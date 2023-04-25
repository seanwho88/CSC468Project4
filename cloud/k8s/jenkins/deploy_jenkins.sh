#!/bin/bash
#can we add setup registry
#can we add docker-compose
set -x


ip_addr=$(ip addr | grep eth0| awk -F ' ' '{print $2}' | awk -F '/' '{print $1'} | tail -n 1)

docker login -u admin -p registry https://${ip_addr}:443

kubectl create secret generic registry-ca --namespace kube-system --from-file=registry-ca=/opt/keys/certs.d/${ip_addr}\:443/ca.crt
kubectl create -f /local/repository/cloud/registry/registry-ca-ds.yaml
#kubectl create secret generic regcred --from-file=.dockerconfigjson=/users/${USER}/.docker/config.json --type=[kubernetes.io/dockerconfigjson](http://kubernetes.io/dockerconfigjson) --namespace=spotter
kubectl create secret generic regcred --from-file=.dockerconfigjson=/users/${USER}/.docker/config.json --type=kubernetes.io/dockerconfigjson --namespace=spotter

helm repo add jenkins https://charts.jenkins.io
helm repo update

export KUBEHEAD=$(kubectl get nodes -o custom-columns=NAME:.status.addresses[1].address,IP:.status.addresses[0].address | grep head | awk -F ' ' '{print $2}')
cp /local/repository/cloud/k8s/jenkins/values.yaml .
sed -i "s/KUBEHEAD/${KUBEHEAD}/g" values.yaml
helm install jenkins jenkins/jenkins --namespace spotter -f values.yaml
kubectl create clusterrolebinding permissive-binding --clusterrole=cluster-admin --user=admin --user=kubelet --group=system:serviceaccounts
kubectl create clusterrolebinding jenkins --clusterrole cluster-admin --serviceaccount=spotter:jenkins

export NODE_PORT=$(kubectl get --namespace spotter -o jsonpath="{.spec.ports[0].nodePort}" services jenkins)
export NODE_IP=$(kubectl get nodes --namespace spotter -o jsonpath="{.items[0].status.addresses[0].address}")
echo http://$NODE_IP:$NODE_PORT/login

ssh-keygen
cat .ssh/id_rsa.pub >> .ssh/authorized_keys
cat ~/.ssh/id_rsa
