pipeline {
  agent any
  stages {
    stage('docker images created & push') {
      steps {
        sh '''docker login registry.gitlab.com
docker build -t registry.gitlab.com/cubix-nodejs/tfl-auth-service .
docker push registry.gitlab.com/cubix-nodejs/tfl-auth-service'''
      }
    }
    stage('output build number') {
      steps {
        sh 'echo $BUILD_NUMBER'
      }
    }
  }
}