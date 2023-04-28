pipeline {
    agent none 
    environment {
        docker_app = "webapp"
        registry = "155.98.37.79"
        userid = "mikec123"
    }
    stages {
        stage('Build') {
            agent {
                kubernetes {
                    inheritFrom 'nodejs'
                }
            }
            steps {
                container('nodejs') {
                    // Create our project directory.
                    //sh 'cp -r ${WORKSPACE}/* .'
                    //sh 'cd webapp/'
                    // Copy all files in our Jenkins workspace to our project directory.                
                    //sh 'npm install'
                    // Build the app.
                    //sh 'npm start' 
                    sh '''
                    cd webapp/
                    npm install
                    npm start
                    '''
                }
            }     
        }
        stage('Publish') {
            agent {
                kubernetes {
                    inheritFrom 'docker'
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
