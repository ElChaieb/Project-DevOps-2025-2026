pipeline {
  agent any

  parameters {
    string(name: 'TARGET_BRANCH', defaultValue: 'dev', description: 'Branch to build')
    booleanParam(name: 'IS_PR', defaultValue: false, description: 'Is this a PR build?')
    string(name: 'TAG_NAME', defaultValue: '', description: 'Optional tag (if versioned build)')
    choice(name: 'RUNTIMES', choices: ['node18'], description: 'Runtime versions to build (comma separated if parallel)')
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          echo "Checking out branch ${params.TARGET_BRANCH}"
          checkout([
            $class: 'GitSCM',
            branches: [[name: "*/${params.TARGET_BRANCH}"]],
            userRemoteConfigs: [[url: 'https://github.com/ElChaieb/Project-DevOps-2025-2026.git']]
          ])
        }
      }
    }

    stage('Setup') {
      steps {
        sh 'node -v || true'
        sh 'npm --version || true'
        sh 'npm ci'
      }
      post {
        failure { error "Setup failed" }
      }
    }

    stage('Build') {
      steps {
        sh 'echo "Building app..."'
        // we don't have a build step in this simple app, but you can add transpile/minify here
        sh 'ls -l'
      }
    }

    stage('Run (Docker)') {
      steps {
        script {
          def imageName = "devops-sample-app:${env.BUILD_NUMBER}"
          sh "docker build -t ${imageName} ."
          // run container in detached mode with a port mapping
          sh "docker run -d --name devops_sample_test -p 3000:3000 ${imageName}"
          // wait a bit for app startup
          sh "sleep 3"
        }
      }
      post {
        failure {
          sh 'docker logs devops_sample_test || true'
          sh 'docker rm -f devops_sample_test || true'
        }
      }
    }

    stage('Smoke Test') {
      steps {
        script {
          echo "Running smoke test against localhost:3000"
          // run node smoke test inside jenkins agent (assumes Node is present)
          sh 'node smoke-test.js'
        }
      }
      post {
        always {
          sh 'echo "Collecting smoke-test result..." || true'
        }
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: '**/*.log, **/reports/**, **/*.json', fingerprint: true
        junit allowEmptyResults: true, testResults: '**/test-results-*.xml'
      }
      post {
        always {
          sh 'docker rm -f devops_sample_test || true'
        }
      }
    }
  }

  post {
    success { echo "Pipeline finished: SUCCESS" }
    failure { echo "Pipeline finished: FAILURE" }
    always { cleanWs() }
  }
}
