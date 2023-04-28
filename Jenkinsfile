pipeline {
    agent none 
    environment {
        docker_registry = 'mikec1233/spotter'
        docker_user =  'mikec1233'
    }
    stages {
        stage('Publish') {
            agent {
                kubernetes {
                    inheritFrom 'worker'
                }
            }
            steps{
                container('docker') {
                    sh 'echo $DOCKER_TOKEN | docker login --username $DOCKER_USER --password-stdin'
                    sh 'docker build -t $DOCKER_REGISTRY:worker-$BUILD_NUMBER ./worker'
                    sh 'docker push $DOCKER_REGISTRY:worker-$BUILD_NUMBER'
                }
            }
        }
        stage ('Deploy') {
            agent {
                node {
                    label 'deploy'
                }
            }
            steps {
                sshagent(credentials: ['cloudlab']) {
                    sh "sed -i 's/DOCKER_USER/${DOCKER_USER}/g' worker.yaml"
                    sh "sed -i 's/BUILD_NUMBER/${BUILD_NUMBER}/g' worker.yaml"
                    sh 'scp -r -v -o StrictHostKeyChecking=no *.yaml zs947869@pcvm709-1.emulab.net:~/'
                    sh 'ssh -o StrictHostKeyChecking=no zs947869@pcvm709-1.emulab.net kubectl apply -f /users/zs947869/worker.yaml -n spotter'
                    sh 'ssh -o StrictHostKeyChecking=no zs947869@pcvm709-1.emulab.net kubectl apply -f /users/zs947869/worker-service.yaml -n spotter'                    
                }
            }
        }
    }
}
