agent none
    environment {
        DOCKER_REGISTRY = "mikec1233/spotter"
        DOCKER_USER = "mikec1233"
    }
    stages {
        stage('Build') {
            steps {
                script {
                    def customImage = docker.build("${DOCKER_REGISTRY}:database", "--file ./Dockerfile .")
                    customImage.push()
                }
            }
        }
        stage('Deploy') {
            steps {
                sh "sed -i 's/DOCKER_USER/${DOCKER_USER}/g' database.yaml"
                sh "kubectl apply -f database.yaml"
                sh "kubectl apply -f database-service.yaml"
            }
        }
    }
}
