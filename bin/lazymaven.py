#!/usr/bin/python3
import argparse
import os
import subprocess
import sys


def run_command_for_output(command):
    std_out = subprocess.check_output(command, stderr=subprocess.STDOUT, shell=True).decode("utf-8")
    return std_out.split("\n")


def run_command_for_exit_code(command):
    return subprocess.call(command, stderr=subprocess.STDOUT, shell=True)


def find_dir_with_pom_xml(file_path):
    latest_slash_pos = file_path.rfind('/')
    new_path = file_path[0:latest_slash_pos]
    if os.path.exists(new_path + '/pom.xml'):
        return new_path
    else:
        return find_dir_with_pom_xml(new_path)


def clean_and_find_dir_with_pom_xml(file_path):
    if not '/' in file_path or file_path.startswith('docker') or file_path.startswith(
            'release-notes') or file_path.startswith('scripts') or file_path.startswith(
        '.gitignore') or file_path.endswith('.md') or file_path.startswith('mvn.sh') or file_path.startswith(
        'documentation'):
        return None
    elif '/pom.xml' in file_path:
        return file_path.replace('/pom.xml', '')
    else:
        return find_dir_with_pom_xml(file_path)


def project_roots(input):
    result = set()
    for line in input:
        dir_with_pom = clean_and_find_dir_with_pom_xml(line)
        if dir_with_pom is not None:
            result.add(dir_with_pom)
    return result


def compute_diffs_git_status():
    result = set()
    lines = run_command_for_output('git status -s')
    for line in lines:
        clean_line = line[3:]
        if '->' in clean_line:
            result.add(clean_line.split('->')[0].strip())
            result.add(clean_line.split('->')[1].strip())
        else:
            result.add(clean_line.strip())
    return project_roots(result)


def compute_diffs_git_diff():
    result = set()
    lines = run_command_for_output('git diff --name-status master')
    for line in lines:
        if line == '':
            continue
        clean_line = line.split('\t')[1]
        if '->' in clean_line:
            result.add(clean_line.split('->')[0].strip())
            result.add(clean_line.split('->')[1].strip())
        else:
            result.add(clean_line.strip())
    return project_roots(result)


def print_compiled_modules(modified):
    index = 0
    print("Found as modified the following modules: \n")
    for line in modified:
        print("> " + str(index) + " :-> " + line)
        index = index + 1


def build_with_diffs(modules, arguments, unknown_args):
    if len(modules) == 0:
        if arguments.local:
            print('No differences between local and origin found for this branch!')
        else:
            print('No differences between master and local branch had been found!')
        return 0

    command = './mvn.sh -amd -pl ' + ','.join(sorted(modules)) + ' ' + ' '.join(arguments.goals) + ' ' + ' '.join(
        unknown_args)
    if arguments.show_cmd:
        print('Using command: \n\t' + command)
    return run_command_for_exit_code(command)


parser = argparse.ArgumentParser(description='Compile only modified modules (and their dependencies)')
parser.add_argument('goals', nargs='+', help='Goals to execute. Example: clean install')
parser.add_argument('--local', action='count', help='Compute git differences using: git status')
parser.add_argument('--show-diffs', action='count', help='show diffs at end')
parser.add_argument('--show-cmd', action='count', help='show command used')
args, unknown = parser.parse_known_args()

if args.local:
    diffs = compute_diffs_git_status()
else:
    diffs = compute_diffs_git_diff()

maven_exit_code = build_with_diffs(diffs, args, unknown)

if args.show_diffs:
    print_compiled_modules(diffs)

if maven_exit_code != 0:
    sys.exit(maven_exit_code)
