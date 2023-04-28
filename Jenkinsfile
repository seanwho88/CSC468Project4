pipeline {
    agent none 
    environment {
        docker_registry = 'manalaro1/web'
        docker_user =  'manalaro1'
    }
    stages {
        stage('Publish') {
            agent {
                kubernetes {
                    inheritFrom 'web'
                }
            }
            steps{
                container('docker') {
                    sh 'echo $DOCKER_TOKEN | docker login --username $DOCKER_USER --password-stdin'
                    sh 'docker build -t $DOCKER_REGISTRY:$BUILD_NUMBER ./ctweb'
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
                    sh "sed -i 's/DOCKER_USER/${DOCKER_USER}/g' web.yaml"
                    sh "sed -i 's/BUILD_NUMBER/${BUILD_NUMBER}/g' web.yaml"
                    sh 'scp -r -v -o StrictHostKeyChecking=no *.yaml patodo@pcvm767-1.emulab.net:~/'
                    sh 'ssh -o StrictHostKeyChecking=no patodo@pcvm767-1.emulab.net kubectl apply -f /users/patodo/web.yaml -n centigro'
                    sh 'ssh -o StrictHostKeyChecking=no patodo@pcvm767-1.emulab.net kubectl apply -f /users/patodo/web-service.yaml -n centigro'                    
                }
            }
        }
    }
}
