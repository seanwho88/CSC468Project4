pipeline {
    agent none 
    environment {
        docker_app = "webapp"
        registry = "155.98.37.79"
        userid = "mikec123"
    }
    stages {
        stage('Publish') {
            agent {
                kubernetes {
                    inheritFrom 'mikec1233/spotter:webapp.7'
                }
            }
            steps{
                container('webapp') {
                    sh 'docker login -u admin -p registry https://${registry}:443'
                    sh 'docker build -t ${registry}:443/webapp:$BUILD_NUMBER .'
                    sh 'docker push ${registry}:443/webapp:$BUILD_NUMBER'
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
                    sh "sed -i 's/REGISTRY/${registry}/g' webapp.yaml"
                    sh "sed -i 's/DOCKER_APP/${docker_app}/g' webapp.yaml"
                    sh "sed -i 's/BUILD_NUMBER/${BUILD_NUMBER}/g' webapp.yaml"
                    sh 'scp -r -v -o StrictHostKeyChecking=no *.yaml ${userid}@${registry}:~/'
                    sh 'ssh -o StrictHostKeyChecking=no ${userid}@${registry} kubectl apply -f /users/${userid}/webapp.yaml'
                    sh 'ssh -o StrictHostKeyChecking=no ${userid}@${registry} kubectl apply -f /users/${userid}/webapp-service.yaml'                                        
                }                  
                }
            }
        }
    }

