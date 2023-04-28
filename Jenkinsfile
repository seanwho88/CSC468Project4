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
                                  
                }
            }
        }
    }
}
