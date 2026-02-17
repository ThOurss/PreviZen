pipeline {
    agent any

    tools {
        nodejs 'node-18'
        dockerTool 'docker-linux' // On s'assure que l'outil est téléchargé
    }

    stages {
        // Étape 1 : Installation (Backend)
        stage('Installation Backend') {
            steps {
                dir('back') { 
                    sh 'npm install'
                }
            }
        }

        // Étape 2 : Construction et Déploiement
        stage('Build & Deploy') {
            steps {
                script {
                    echo "--- RECHERCHE DE DOCKER (JUSTE AVANT LE BUILD) ---"
                   
                    def dockerCmd = sh(script: 'find /var/jenkins_home/tools -name "docker" -type f | head -n 1', returnStdout: true).trim()
                    
                    
                    sh "chmod +x ${dockerCmd}"
                    
                    echo "Docker trouvé : ${dockerCmd}"
                    echo "Construction de l'image..."

                   
                  
                    sh "${dockerCmd} build -t previzen-api ./back"
                    
                    echo "--- REDÉMARRAGE DU CONTENEUR ---"
                    
                    // "|| true" permet de ne pas planter si le conteneur n'existe pas encore
                    sh "${dockerCmd} stop mon-api || true"
                    sh "${dockerCmd} rm mon-api || true"
                    
                    // Lancement final (Port 5000, Réseau par défaut)
                   
                    sh "${dockerCmd} run -d --name mon-api -p 5000:5000 --network previzen_default previzen-api"
                }
            }
        }
    }
}