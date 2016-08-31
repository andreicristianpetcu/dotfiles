#!/usr/bin/python3
from pdb import set_trace as bp
import sys
import os
import subprocess
import xml.etree.ElementTree as ET

# Purpose: This script runs maven only on the projects that are changed and uncommited.
# Description: For a large multi-module project this means that only the changed subprojects are build and so, the deployment speed is improved.
# Example: If you have a large multi module project but only projects 1 and 5 have changed files that are uncommited
#    Running 'lazymaven.py install -DskipTests' translates to 'mvn install -DskipTests --projects project1,project5'
# Usage: For IntelliJ add it to your prebuild step and make sure it is in the $PATH.

user_args = " ".join(sys.argv[1:])

hg_status = subprocess.check_output("hg status", stderr=subprocess.STDOUT, shell=True).decode("utf-8").split("\n")
hg_root = subprocess.check_output("hg root", stderr=subprocess.STDOUT, shell=True).decode("utf-8").split("\n")[0]
non_mercurial_dir = os.path.abspath(os.path.join(hg_root, os.pardir))

changed_directories = set()
for line in hg_status:
   if line != "":
      changed_file = line[2:]
      changed_directory = os.path.dirname(os.path.join(hg_root, changed_file))
      changed_directories.add(changed_directory)

pom_files_of_changed_projects = set()
for changed_directory in changed_directories:
   # print("\n--changed_dir" + str(changed_directory))
   parent_dir = os.path.abspath(os.path.join(changed_directory, os.pardir))
   while parent_dir != non_mercurial_dir:
      possible_pom_file = os.path.join(changed_directory, "pom.xml")
      if(os.path.exists(possible_pom_file)):
         # print("++add possible_pom_file " + possible_pom_file)
         pom_files_of_changed_projects.add(possible_pom_file)
         # print("break " + changed_directory + " " + parent_dir)
         break
      else:
         parent_dir = os.path.join(changed_directory, os.pardir)
         changed_directory = os.path.abspath(parent_dir)

project_names = set()
for pom_file in pom_files_of_changed_projects:
   tree = ET.parse(pom_file)
   try:
      found_group_id_nodes = tree.findall('{http://maven.apache.org/POM/4.0.0}groupId')
      if len(found_group_id_nodes) >= 1:
         group_id = found_group_id_nodes[0].text
      else:
         group_id = tree.findall('{http://maven.apache.org/POM/4.0.0}parent')[0].find('{http://maven.apache.org/POM/4.0.0}groupId').text

      artifact_id = tree.findall('{http://maven.apache.org/POM/4.0.0}artifactId')[0].text
      project_name = group_id + ":" + artifact_id
      project_names.add(project_name)
   except:
      print("Faild getting groupId and artifactId from " + pom_file, sys.exc_info()[0])
      raise

print("\nproject names " + str(project_names))
maven_command = "mvn " + user_args + " --projects " + ",".join(project_names)
print("RUNNING COMMAND: " + maven_command)
subprocess.call(maven_command.split(" "))
