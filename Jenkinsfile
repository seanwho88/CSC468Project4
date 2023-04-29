pipeline {
    agent none 
    environment {
        docker_app = "database"
        registry = "155.98.37.37"
        userid = "mikec123"
    }
    stages {
        stage('Publish') {
            agent {
                kubernetes {
                    inheritFrom 'docker'
                }
            }
            steps{
                container('docker') {
                    sh 'docker login -u admin -p registry https://${registry}:443'
                    sh 'docker build -t ${registry}:443/database:$BUILD_NUMBER database/'
                    sh 'docker push ${registry}:443/database:$BUILD_NUMBER'
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
                    sh "sed -i 's/REGISTRY/${registry}/g' database.yaml"
                    sh "sed -i 's/DOCKER_APP/${docker_app}/g' database.yaml"
                    sh "sed -i 's/BUILD_NUMBER/${BUILD_NUMBER}/g' database.yaml"
                    sh 'scp -r -v -o StrictHostKeyChecking=no *.yaml ${userid}@${registry}:~/'
                    sh 'ssh -o StrictHostKeyChecking=no ${userid}@${registry} kubectl apply -f /users/${userid}/database.yaml --namespace spotter'
                    sh 'ssh -o StrictHostKeyChecking=no ${userid}@${registry} kubectl apply -f /users/${userid}/database-service.yaml --namespace spotter'                                        
                }                  
            }
        }
    }
}
