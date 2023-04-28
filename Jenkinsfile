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
                    inheritFrom 'webapp'
                }
            }
            steps{
                container('docker') {
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
                                  
                }
            }
        }
    }

