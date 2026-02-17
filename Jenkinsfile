pipeline {
    agent any

    tools {
        nodejs 'node-18'
        dockerTool 'docker-linux'
    }

    environment {
        // On définit une variable globale pour ne pas retaper la recherche à chaque fois
        // (Note: On initialise vide, on la remplira au premier stage)
        DOCKER_CMD = '' 
    }

    stages {
        // Étape 1 : Préparation technique (Le fix qu'on a trouvé)
        stage('Initialisation Docker') {
            steps {
                script {
                    // On retrouve notre exécutable Docker
                    def dockerPath = sh(script: 'find /var/jenkins_home/tools -name "docker" -type f | head -n 1', returnStdout: true).trim()
                    sh "chmod +x ${dockerPath}"
                    // On le sauvegarde dans la variable d'environnement pour l'utiliser partout
                    env.DOCKER_CMD = dockerPath
                    echo "Docker est prêt : ${env.DOCKER_CMD}"
                }
            }
        }

        // Étape 2 : Installation des dépendances (Backend)
        stage('Install Backend') {
            steps {
                dir('server') { // On rentre dans le dossier 'server'
                    sh 'npm install'
                }
            }
        }

        // Étape 3 : Tests (Si vous en avez)
        stage('Test Backend') {
            steps {
                dir('server') {
                    echo "Lancement des tests..."
                    // sh 'npm test' // Décommentez quand vous aurez des tests
                }
            }
        }

        // Étape 4 : Construction et Redéploiement
        stage('Build & Deploy') {
            steps {
                script {
                    echo "Construction de la nouvelle image..."
                    // On utilise notre Docker pour reconstruire l'API
                    sh "${env.DOCKER_CMD} build -t previzen-api ./server"
                    
                    echo "Redémarrage du conteneur..."
                    // On arrête l'ancien conteneur et on lance le nouveau
                    // Note : Pour l'instant on fait simple, plus tard on utilisera docker-compose
                    sh "${env.DOCKER_CMD} stop mon-api || true"
                    sh "${env.DOCKER_CMD} rm mon-api || true"
                    sh "${env.DOCKER_CMD} run -d --name mon-api -p 5000:5000 --network previzen_default previzen-api"
                }
            }
        }
    }
}