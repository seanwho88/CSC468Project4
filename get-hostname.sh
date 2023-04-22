#!/bin/sh
echo "get-hostname.sh script"

hostname=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}' | awk '{print $NF}' | sed 's/\.$//')
echo -n "$hostname" > /data/head_node_hostname.txt
echo "Head node hostname: $hostname"
