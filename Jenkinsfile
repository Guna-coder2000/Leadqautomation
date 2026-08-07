pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.44.0-focal' // Match to Playwright version
            args '-u root'
        }
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                // Run tests, but allow pipeline to proceed if tests fail to generate reports
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm run test'
                }
            }
        }
        
        stage('Generate Allure Report') {
            steps {
                // This triggers the save-history.js detection logic specifically for Jenkins
                sh 'npm run report:generate'
            }
        }
    }
    
    post {
        always {
            // Jenkins Allure plugin requires configuring this step
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            
            // Or archive the statically generated HTML report
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
