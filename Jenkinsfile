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
                    inheritFrom 'webapp'
                }
            }
            steps{
                container('docker') {
                    sh 'echo $DOCKER_TOKEN | docker login --username $DOCKER_USER --password-stdin'
                    sh 'docker build -t $DOCKER_REGISTRY:$BUILD_NUMBER ./webapp'
                    sh 'docker push $DOCKER_REGISTRY:$BUILD_NUMBER'
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
                    sh "sed -i 's/DOCKER_USER/${DOCKER_USER}/g' webapp.yaml"
                    sh "sed -i 's/BUILD_NUMBER/${BUILD_NUMBER}/g' webapp.yaml"
                    sh 'scp -r -v -o StrictHostKeyChecking=no *.yaml patodo@pcvm767-1.emulab.net:~/'
                    sh 'ssh -o StrictHostKeyChecking=no patodo@pcvm767-1.emulab.net kubectl apply -f /users//webapp.yaml -n spotter'
                    sh 'ssh -o StrictHostKeyChecking=no patodo@pcvm767-1.emulab.net kubectl apply -f /users/patodo/webapp-service.yaml -n spotter'                    
                }
            }
        }
    }
}
