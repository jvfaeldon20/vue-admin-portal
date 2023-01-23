pipeline {
    agent {
        label 'AWS-Slave-Test-Node'
    }
 
    tools {
        nodejs "PCCB"
    }

    environment {
        // ***** SETUP BUILD ENVIRONMENT ******
        CI = 'true'
        // SCANNER_HOME             = tool('it-devops')
        SCANNER_HOME                = tool('sonarqube-gisauto')    // REPLACE
        REGISTRY_URI                = "aws.registry.----.com"
        REGISTRY_NAME               = "---------" // REPLACE
        IMAGE_NAME                  = "---------"       // REPLACE
        VERSION                     = "${BUILD_NUMBER}"
        LATEST                      = "latest"
        EKS_PROD_NAMESPACE          = "itdev"                      // REPLACE
        EKS_STG_NAMESPACE           = "itdev-stg"                  // REPLACE
        ROBOT_PASS_THRESHOLD        = 50
        ROBOT_UNSTABLE_THRESHOLD    = 25
        SMARTCHECK_URL              = 'dssc.gisauto.----.com'
        SMARTCHECK_CRED_ID          = 'dssc_jenkins'
        SERVER_URL                  = 'https://9648AA00EA605640C858DE1299A47F3C.yl4.us-west-2.eks.amazonaws.com'
        CLUSTER_NAME                = 'eks-prd'
        MST_WEBHOOK_URL             = 'https://----.webhook.office.com/webhookb2/109a36df-9f9d-4763-9025-80c9e2e58660@3e04753a-ae5b-42d4-a86d-d6f05460f9e4/JenkinsCI/2e9e4f0870954a7ca1d081b6e7f3527f/cbc5fb88-d226-49d0-826e-5df9956eee41'
        MAIL_RECIPIENTS             = 'jonelfaeldon@gmail.com'
        WARG_TOKEN                  = credentials('WARG_TOKEN')
        WARG_RECIPIENTS             = 'jonelfaeldon@gmail.com' // REPLACE
        PROJECT_NETWORK             = 'INTERNAL'
        PROJECT_HOST                = '-----'         // REPLACE
        PROJECT_URL                 = '-----' // REPLACE
        PROJECT_CODE                = 'NONE' // If applicable, set to your JID/PRS project code. e.g. PDG_XXXXXX, ISG_XXXXXX
        AUTOTEST_CRED_ID            = 'sa-test-autotesting' 
    }
 
    stages {
        stage('Initial Notification') {
            steps {
                office365ConnectorSend message: "$JOB_NAME $BUILD_DISPLAY_NAME", status: "Build has started", webhookUrl: "$MST_WEBHOOK_URL"
                echo 'Pipeline execution success'
            }
        }
 
        // ***** ANALYSE CODE WITH CODE SCANNER *****
        // sonar-project.properties should be included in your project folder
        // By default, it-devops tool will be used as Sonar Scanner
        stage('Code Analysis') {           
            when{
                not {branch 'master'}
            }
            steps {
                echo 'Scanning code with Sonar Scanner and wait for results'
                // withSonarQubeEnv('it-devops') {      // Default is it-devops
                withSonarQubeEnv('sonarqube-gisauto') { // For new SonarQube
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
                sh 'sleep 30'
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
            post{
                success{
                    echo "Successfully analyzed code"
                }
                failure{
                    echo "Failed analyzing code"
                }
            }
        }

        // ***** APPLICATION BUILD STAGE *****
        //  Builds Docker image based on Dockerfile configuration
        //  Specify image names from environment section (at the top of file)
        stage("Build Staging"){
            when {
                branch 'staging'
            }
            steps {withCredentials([usernamePassword(credentialsId: 'harbor-system-robot-account', passwordVariable: 'HARBOR_ACCOUNT_PSW', usernameVariable: 'HARBOR_ACCOUNT_USR')]) {
                    sh 'docker login ${REGISTRY_URI} -u ${HARBOR_ACCOUNT_USR} -p ${HARBOR_ACCOUNT_PSW}'
                }
                 
                echo 'Building application'
                sh 'docker build -t ${IMAGE_NAME}:${VERSION_PREFIX}${BUILD_NUMBER} ${WORKSPACE} -f Dockerfile'
                
                echo "Tagging Docker image"
                sh """
                    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:staging-${VERSION}
                    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:staging-${LATEST}
                """
                echo "Pushing  Docker images to ${REGISTRY_URI}"
                sh """
                    docker push ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:staging-${VERSION}
                    docker push ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:staging-${LATEST}
                """
                echo "Clean up Docker image ${IMAGE_NAME}:${VERSION}"
                sh """
                    docker rmi ${IMAGE_NAME}:${VERSION}
                """
            }
            post{
                success{
                    echo "Successfully built image"
                }
                failure{
                    echo "Failed building image"
                }
            }
        }

        stage("Build Production"){
            when {
                branch 'master'
            }
            steps {withCredentials([usernamePassword(credentialsId: 'harbor-system-robot-account', passwordVariable: 'HARBOR_ACCOUNT_PSW', usernameVariable: 'HARBOR_ACCOUNT_USR')]) {
                    sh 'docker login ${REGISTRY_URI} -u ${HARBOR_ACCOUNT_USR} -p ${HARBOR_ACCOUNT_PSW}'
                }
                 
                echo 'Building application'
                sh 'docker build -t ${IMAGE_NAME}:${VERSION_PREFIX}${BUILD_NUMBER} ${WORKSPACE} -f Dockerfile'
                
                echo "Tagging Docker image"
                sh """
                    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${VERSION}
                    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${LATEST}
                """
                echo "Pushing  Docker images to ${REGISTRY_URI}"
                sh """
                    docker push ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${VERSION}
                    docker push ${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${LATEST}
                """
                echo "Clean up Docker image ${IMAGE_NAME}:${VERSION}"
                sh """
                    docker rmi ${IMAGE_NAME}:${VERSION}
                """
            }
            post{
                success{
                    echo "Successfully built image"
                }
                failure{
                    echo "Failed building image"
                }
            }
        }

        stage('Image Scan') {
            when{
                not {branch 'master'}
            }
            steps {
                withCredentials([
                    usernamePassword([
                        credentialsId: "harbor-system-robot-account",
                        usernameVariable: "HARBOR_ACCOUNT_USR",
                        passwordVariable: "HARBOR_ACCOUNT_PSW",
                    ])
                ]){
            
                    smartcheckScan([
                        imageName: "${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${GIT_BRANCH}-${LATEST}",
                        smartcheckHost: "$SMARTCHECK_URL",
                        insecureSkipTLSVerify: true,
                        smartcheckCredentialsId: "$SMARTCHECK_CRED_ID",
                        imagePullAuth: new groovy.json.JsonBuilder([
                            username: HARBOR_ACCOUNT_USR,
                            password: HARBOR_ACCOUNT_PSW,
                        ]).toString(),
                        findingsThreshold: new groovy.json.JsonBuilder([
                            malware: 0,
                            vulnerabilities: [
                                defcon1: 0,
                                critical: 0,
                                high: 0,
                            ],
                            contents: [
                                defcon1: 0,
                                critical: 0,
                                high: 0,
                            ],
                            checklists: [
                                defcon1: 0,
                                critical: 0,
                                high: 0,
                            ],
                        ]).toString(),
                    ])
                }
            }
            post{
                success{
                    echo "Successfully scanned image"
                }
                failure{
                    echo "Failed scanning image"
                }
            }
        }
        
        // ***** JEST UNIT AUTOTESTING *****
        //  Run unit test to vue components and perform axios request
        stage("Unit Auto testing"){
            when {
                branch 'staging'
            }
            steps {
                echo 'Unit testing has started...'
                sh """
                    npm install @vue/cli
                    npm run test:unit
                """
                echo 'Unit testing has ended'
            }
            post{
                success{
                    echo "Successful Unit Testing"
                }
                failure{
                    echo "Failed Unit Testing"
                }
            }
        }

        // ***** NIGHTWATCHJS E2E TESTING STAGE *****
        //  Run UI testing and performs E2E testing
        // stage("E2E Auto testing"){
        //     when {
        //         branch 'staging'
        //     }
        //     steps {
        //         echo '*******************************************'
        //         echo '********start Nightwatch UI testing********'
        //         echo '*******************************************'
        //         withCredentials([usernamePassword(credentialsId: "$AUTOTEST_CRED_ID", passwordVariable: 'AUTOTEST_ACCOUNT_PSW', usernameVariable: 'AUTOTEST_ACCOUNT_USR')]) {
        //             sh 'npm install @vue/cli'
        //             sh 'npm i chromedriver'
        //             sh 'npm run test:e2e'
        //         }
        //         echo '*******************************************'
        //         echo '*********end Nightwatch UI testing*********'
        //         echo '*******************************************'
        //     }
        //     post{
        //         success{
        //             echo "Successful Nightwatch Auto-Testing"
        //         }
        //         failure{
        //             echo "Failed Nightwatch Auto-Testing"
        //         }
        //     }
        // }

        // ***** DEPLOYMENT TO STAGING ENVIRONMENT *****
        //  Logs in to your Docker Registry
        //  Tags Docker image to registry
        //  Pushes Docker image to registry
        //  Deploys your yaml to Kubernetes
        stage("Deploy to Staging"){
            when {
                branch 'staging'
            }
            // steps {
            //     // kubernetesDeploy kubeconfigId: 'kube-itdev-stg', configs: 'kubernetes/staging/*.yaml', enableConfigSubstitution: true  // REPLACE kubeconfigId
            // }
            steps {
                withKubeConfig([credentialsId: 'kube-itdev-stg-token', serverUrl: "$SERVER_URL", clusterName: "$CLUSTER_NAME", namespace: "$EKS_STG_NAMESPACE"]) {
                    //sh"""
                    //    sed -i 's/${BUILD_NUMBER}/${BUILD_NUMBER}/' kubernetes/staging/*.yaml
                    //    kubectl apply -f kubernetes/staging/*.yaml
                    //"""
                    sh """
                        kubectl apply -f kubernetes/staging/*.yaml
                        kubectl set image deployment/itdev-gis-automation-admin itdev-gis-automation-admin=${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${GIT_BRANCH}-${VERSION}
                    """
                }   
            }
            post{
                success{
                    echo "Successfully deployed to Staging"
                }
                failure{
                    echo "Failed deploying to Staging"
                }
            }
        }

        // ***** DEPLOYMENT TO PRODUCTION ENVIRONMENT *****
        //  Logs in to your Docker Registry
        //  Tags Docker image to registry
        //  Pushes Docker image to registry
        //  Deploys your yaml to Kubernetes
        stage("Deploy to Production"){
            when {
                branch 'master'
            }
             steps {
                withKubeConfig([credentialsId: 'kube-itdev-token', serverUrl: "$SERVER_URL", clusterName: "$CLUSTER_NAME", namespace: "$EKS_PROD_NAMESPACE"]) {
                    //sh"""
                    //    sed -i 's/${BUILD_NUMBER}/${BUILD_NUMBER}/' kubernetes/production/*.yaml
                    //    kubectl apply -f kubernetes/production/*.yaml
                    //"""
                    sh """
                        kubectl apply -f kubernetes/production/Deployment.yaml
                        kubectl set image deployment/itdev-gis-automation-admin itdev-gis-automation-admin=${REGISTRY_URI}/${REGISTRY_NAME}/${IMAGE_NAME}:${VERSION}
                    """
                }   
            }
            post{
                success{
                    echo "Successfully deployed to Production"
                }
                failure{
                    echo "Failed deploying to Production"
                }
            } 
        }


        // ***** INFOSEC WARG - Nessus Professional SCAN *****
        // stage('Nessus Professional Scan') {
        //     when{
        //         not {branch 'master'}
        //     }
        //     steps {
        //         sh """
        //             echo "Creating Virtual Environment for Testing"
        //             pwd
        //             virtualenv -p python3.7 env
        //             source env/bin/activate
        //             cd warg; pip install -r requirements.txt; python3 nessusprofessional.py $PROJECT_HOST $PROJECT_NETWORK $WARG_RECIPIENTS $PROJECT_CODE
        //         """
        //         archiveArtifacts 'warg/warg-nessus-professional.csv'
        //         script {
        //             def log = currentBuild.rawBuild.log
        //             if (log.contains('severity CRITICAL')) {
        //                 echo "*** Attention!!! Nessus Professional Scan found out CRITICAL severity ***"
        //                 error("Build failed because of Nessus Professional Scan found out CRITICAL severity")
        //             } else if (log.contains('severity HIGH')) {
        //                 echo "*** Attention!!! Nessus Professional Scan found out HIGH severity ***"
        //                 error("Build failed because of Nessus Professional Scan found out HIGH severity")
        //             } else if (log.contains('severity MEDIUM')) {
        //                 echo "*** Attention!!! Nessus Professional Scan found out MEDIUM severity ***"
        //                 currentBuild.result = "UNSTABLE"
        //             }
        //         }
        //     }
        //     post{
        //         success{
        //             echo "Nessus Professional Scan Successful"
        //         }
        //         failure{
        //             echo "Nessus Professional Scan Failed"
        //         }
        //     }
        // }
        
        
    }
 
    post{
        // always{
        //     // (OPTIONAL) IF YOU DON'T HAVE ROBOT TEST YET, COMMENT THIS STEP
        //     step([
        //         $class: 'RobotPublisher',
        //         outputPath: 'tests',
        //         outputFileName: "**/output.xml",
        //         reportFileName: '**/report.html',
        //         logFileName: '**/log.html',
        //         disableArchiveOutput: false,
        //         passThreshold: "${ROBOT_PASS_THRESHOLD}" as double,
        //         unstableThreshold: "${ROBOT_UNSTABLE_THRESHOLD}" as double
        //     ])
        // }
        success{
            // SENDS OUT TEAMS NOTIFICATION IF SUCCESSFUL
            office365ConnectorSend message: "$JOB_NAME $BUILD_DISPLAY_NAME", status: "Build Successful", webhookUrl: "$MST_WEBHOOK_URL"
            echo 'Pipeline execution success'
 
            // SENDS OUT MAIL NOTIFICATION ABOUT THE STATUS OF THIS BUILD
            step([
                $class: 'Mailer',
                notifyEveryUnstableBuild: true,
                recipients: "$MAIL_RECIPIENTS",
                sendToIndividuals: false
            ])
        }
        failure{
            // SENDS OUT TEAMS NOTIFICATION IF FAILED
            office365ConnectorSend message: "$JOB_NAME $BUILD_DISPLAY_NAME", status: "Build Failed", webhookUrl: "$MST_WEBHOOK_URL"
            echo "Pipeline execution failed"
             
            // SENDS OUT MAIL NOTIFICATION ABOUT THE STATUS OF THIS BUILD
            step([
                $class: 'Mailer',
                notifyEveryUnstableBuild: true,
                recipients: "$MAIL_RECIPIENTS",
                sendToIndividuals: false
            ])
        }
        unstable{
            // SENDS OUT TEAMS NOTIFICATION IF UNSTABLE
            office365ConnectorSend message: "$JOB_NAME $BUILD_DISPLAY_NAME", status: "Build Unstable", webhookUrl: "$MST_WEBHOOK_URL"
            echo "Pipeline execution unstable"
              
            // SENDS OUT MAIL NOTIFICATION ABOUT THE STATUS OF THIS BUILD
            step([
                $class: 'Mailer',
                notifyEveryUnstableBuild: true,
                recipients: "$MAIL_RECIPIENTS",
                sendToIndividuals: false
            ])
        }
    }
}