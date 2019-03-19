#!/usr/bin/python3
from pdb import set_trace as bp
import sys
import os
import subprocess
import xml.etree.ElementTree as ET

globals = {}

ignored_projects = set()
ignored_projects.add('com.connectis:federation')
ignored_projects.add('com.connectis.localhost:dev-configuration')

def save_previous_artifacts_to_file(artifacts_set):
    previous_artifacts_file_path = get_previous_artifacts_file_path()
    if not os.path.exists(os.path.dirname(previous_artifacts_file_path)):
        try:
            os.makedirs(os.path.dirname(previous_artifacts_file_path))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
    config_file = open(previous_artifacts_file_path, 'w')
    for artifact in artifacts_set:
        config_file.write("%s\n" % artifact)

def get_previous_artifacts_from_file():
    content = []
    fname = get_previous_artifacts_file_path()
    if os.path.isfile(fname):
        with open(fname) as f:
            content = f.readlines()
        content = [x.strip() for x in content]
    return set(content)

def get_hg_branch():
    if 'hg_branch' in globals:
        return globals['hg_branch']
    else:
        globals['hg_branch'] = execute_command_and_get_lines("hg branch")[0]
        return globals['hg_branch']

def get_hg_root():
    if 'hg_root' in globals:
        return globals['hg_root']
    else:
        globals['hg_root'] = execute_command_and_get_lines("hg root")[0]
        return globals['hg_root']

def get_previous_artifacts_file_path():
    return get_hg_root() + "/.hg/lazymaven/" + get_hg_branch()

def execute_command_and_get_lines(command_to_execute):
    print("------ EXECUTING: \n$" + command_to_execute)
    std_out = subprocess.check_output(command_to_execute, stderr=subprocess.STDOUT, shell=True).decode("utf-8")
    print("------ OUTPUT IS:")
    print(std_out)
    return std_out.split("\n")


def get_mercurial_stauts():
    return execute_command_and_get_lines("hg status")


def get_changed_directories():
    changed_directories = set()
    hg_status = get_mercurial_stauts()
    too_many_changed_poms = len([line for line in hg_status if line != "" and line[2:].endswith('pom.xml')]) > 100
    if too_many_changed_poms:
        print("------ MORE THAN 100 pom files. Will be ignored by diff. Are you doing a merge?")

    for line in hg_status:
        if line != "":
            changed_file = line[2:]
            ignore_because_orig = changed_file.endswith('.orig')
            ignore_because_pom = changed_file.endswith('pom.xml') and too_many_changed_poms
            if ignore_because_orig or ignore_because_pom:
                print("------ IGNORING " + changed_file)
            else:
                changed_directory = os.path.dirname(os.path.join(get_hg_root(), changed_file))
                changed_directories.add(changed_directory)
                print("------ ADDING   " + changed_directory)
    print("------ CHANGED DIRECTORIES ARE: " + str(len(changed_directories)) + "\n" + ("\n".join(sorted(changed_directories))))
    return changed_directories


def get_pom_files_of_changed_projects():
    non_mercurial_dir = os.path.abspath(os.path.join(get_hg_root(), os.pardir))

    changed_directories = get_changed_directories()
    pom_files_of_changed_projects = set()
    for changed_directory in changed_directories:
        # print("\n--changed_dir" + str(changed_directory))

        parent_dir = os.path.abspath(os.path.join(changed_directory, os.pardir))
        while parent_dir != non_mercurial_dir:
            possible_pom_file = os.path.join(changed_directory, "pom.xml")
            if os.path.exists(possible_pom_file):
                # print("++add possible_pom_file " + possible_pom_file)
                pom_files_of_changed_projects.add(possible_pom_file)
                # print("break " + changed_directory + " " + parent_dir)
                break
            else:
                parent_dir = os.path.join(changed_directory, os.pardir)
                changed_directory = os.path.abspath(parent_dir)
    return pom_files_of_changed_projects


def get_groupid_and_artifactid(tree):
    found_group_id_nodes = tree.findall('{http://maven.apache.org/POM/4.0.0}groupId')
    if len(found_group_id_nodes) >= 1:
        group_id = found_group_id_nodes[0].text
    else:
        group_id = tree.findall('{http://maven.apache.org/POM/4.0.0}parent')[0].find(
            '{http://maven.apache.org/POM/4.0.0}groupId').text

    artifact_id = tree.findall('{http://maven.apache.org/POM/4.0.0}artifactId')[0].text
    project_name = group_id + ":" + artifact_id
    return project_name


def get_parent_groupid_and_artifactid(tree):
    parent_nodes = tree.findall('{http://maven.apache.org/POM/4.0.0}parent')
    if len(parent_nodes) > 0:
        parent = parent_nodes[0]
        parent_group_id = parent.find('{http://maven.apache.org/POM/4.0.0}groupId').text
        parent_artifact_id = parent.find('{http://maven.apache.org/POM/4.0.0}artifactId').text
        return parent_group_id + ":" + parent_artifact_id


def get_maven_changed_project_names():
    pom_files_of_changed_projects = get_pom_files_of_changed_projects()

    project_names = set()
    for pom_file in pom_files_of_changed_projects:
        tree = ET.parse(pom_file)
        try:
            project_name = get_groupid_and_artifactid(tree)
            project_names.add(project_name)

            # parent_project_name = get_parent_groupid_and_artifactid(tree)
            # if parent_project_name:
            #     project_names.add(parent_project_name)
        except:
            print("Faild getting groupId and artifactId from " + pom_file, sys.exc_info()[0])
            raise
    return project_names

def remove_ignored_projects(all_projects, projects_to_ignore):
    for project_to_ignore in projects_to_ignore:
        if project_to_ignore in all_projects:
            all_projects.remove(project_to_ignore)
    return all_projects

def get_java_home(arguments):
    for argument in arguments:
        if argument.startswith('JAVA_HOME='):
            return argument.split('=')[1]

def clean_arguments(arguments):
    cleaned_arguments = set()
    for argument in arguments:
        if not argument.startswith('JAVA_HOME='):
            cleaned_arguments.add(argument)
    return cleaned_arguments

def execute_mvn_with_args_on_projects(new_project_names):
    previous_project_names = get_previous_artifacts_from_file()
    merged_project_names = set()
    merged_project_names.update(new_project_names)
    merged_project_names.update(previous_project_names)
    previous_project_names = sorted(previous_project_names)
    merged_project_names = sorted(merged_project_names)
    merged_project_names = remove_ignored_projects(merged_project_names, ignored_projects)
    print("------ NEW PROJECT NAMES: " + str(len(new_project_names)) + "\n" + ("\n".join(sorted(new_project_names))))
    print("------ PREVIOUS PROJECT NAMES: " + str(len(previous_project_names)) + "\n" + ("\n".join(sorted(previous_project_names))))
    print("------ IGNORED PROJECT NAMES: " + str(len(ignored_projects)) + "\n" + ("\n".join(ignored_projects)))
    print("------ TOTAL PROJECT NAMES: " + str(len(merged_project_names)) + "\n" + ("\n".join(merged_project_names)))
    print("------ PREVIOUS ARTIFACTS FILE: \n" + get_previous_artifacts_file_path())
    save_previous_artifacts_to_file(merged_project_names)

    my_env = os.environ.copy()
    if len(sys.argv) > 1:
        java_home = get_java_home(sys.argv[1:])
        if java_home:
            my_env['JAVA_HOME']=java_home
        user_args = " ".join(clean_arguments(sys.argv[1:]))
    else:
        user_args = "compile test"

    if len(merged_project_names) == 0:
        print("----------------------------------------------------------------------------------------------\n"
              "No projects changed. This script builds partially only changed projects. No changes, no build.\n"
              "----------------------------------------------------------------------------------------------")
        sys.exit(0)

    maven_command = "mvn " + user_args + " --projects " + ",".join(merged_project_names)
    print("------ EXECUTING: \n$" + maven_command)

    sys.stdout.flush()
    sys.stderr.flush()
    maven_exit_code = subprocess.call(maven_command.split(" "), env=my_env)
    if maven_exit_code != 0:
        sys.exit(maven_exit_code)


# Purpose: This script runs maven only on the projects that are changed and uncommited.
# Description: For a large multi-module project this means that only the changed subprojects are build and so, the deployment speed is improved.
# Example: If you have a large multi module project but only projects 1 and 5 have changed files that are uncommited
#    Running 'lazymaven.py install -DskipTests' translates to 'mvn install -DskipTests --projects project1,project5'
# Usage: For IntelliJ add it to your prebuild step and make sure it is in the $PATH.

project_names = get_maven_changed_project_names()
execute_mvn_with_args_on_projects(project_names)
