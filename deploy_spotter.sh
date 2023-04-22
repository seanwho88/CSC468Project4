#!/bin/bash
set -x
namespaceStatus=$(kubectl get namespaces spotter -o json | jq .status.phase -r)

if [ $namespaceStatus == "Active" ]
then
    echo "Namespace spotter exists, need to clean up"
    kubectl delete namespaces spotter
fi

echo "Creating namespace spotter"
kubectl create namespace spotter

echo "Creating pods"
kubectl create -f spotter.yaml --namespace spotter

echo "Creating services"
kubectl create -f spotter-service.yaml --namespace spotter

echo "Creating config map"
kubectl create -f hostnameconfig.yaml --namespace spotter
<<<<<<< HEAD
=======
kubectl apply -f hostnameconfig.yaml --namespace spotter
>>>>>>> e75dcefc5f0c962496e0333fd8705895b9f35c76

kubectl get pods -n spotter
