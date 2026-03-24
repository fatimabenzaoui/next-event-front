import { Accordion, Avatar, Box, Typography, Link } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ApiIcon from '@mui/icons-material/Api';
import TerminalIcon from '@mui/icons-material/Terminal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ConstructionIcon from '@mui/icons-material/Construction';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import notionIcon from '../assets/notion.png';
import githubIcon from '../assets/github.png';
import trelloIcon from '../assets/trello.png';
import figmaIcon from '../assets/figma.png';

import eventsClassDiagram from '../assets/events-class-diagram.png';
import studentsClassDiagram from '../assets/students-class-diagram.png';
import associationsClassDiagram from '../assets/associations-class-diagram.png';
import nextEventClassDiagram from '../assets/next-event-class-diagram.png';
import usersClassDiagram from '../assets/users-class-diagram.png';

function Documentation() {
  return (
    <Box sx={{ p: 1 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box sx={titleBox}>
            <TerminalIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Principales commandes</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            BACK<br/>
            - Créer un environnement virtuel : python -m venv env<br/>
            - Activer l'environnement virtuel sur Windows : env\Scripts\activate<br/>
            - Activer l'environnement virtuel sur Linux et Mac : source venv/bin/activate<br/><br/>
            - Python dependencies :<br/>
            - pip install django djangorestframework<br/>
            - pip install django-cors-headers<br/>
            - pip install pillow<br/>
            - pip install geopy<br/>
            - pip install django-filter<br/>
            - pip install mysqlclient<br/><br/>

            - Créer un projet Django : django-admin startproject back .<br/>
            - Créer une application Django : django-admin startapp event<br/>
            - Démarrer l'application : python manage.py runserver<br/>
            - Installer les dépendances de requirements.txt : pip install -r requirements.txt<br/>
            - Mettre à jour le fichier requirements.txt : pip freeze &gt; requirements.txt<br/><br/>

            - Créer une ou des tables : python manage.py makemigrations<br/>
            - Appliquer la migration : python manage.py migrate<br/><br/>

            FRONT<br/>
            - Générer une application React avec Vite : npm create vite@latest<br/>
            - Démarrer l'application : npm run dev<br/>
            - Installer les dépendances du package.json : npm install<br/><br/>
            - Node dependencies :<br/>
              - npm install axios<br/>
              - npm install @mui/material @emotion/react @emotion/styled<br/>
              - npm install @fontsource/roboto<br/>
              - npm install @mui/icons-material<br/>
              - npm install @mui/x-data-grid@^8.0.0<br/>
              - npm install react-pro-sidebar<br/>
              - npm install react-router-dom<br/>
              - npm install react-toastify<br/>
              - npm install dayjs<br/>
              - npm install @mui/x-date-pickers<br/>
              - npm install date-fns@latest<br/>
              - npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/core<br/>
              - npm install react-chartjs-2<br/>
              - npm install framer-motion react-slick slick-carousel<br/>
              - npm install leaflet react-leaflet leaflet-routing-machine<br/>
              - npm install gh-pages
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box sx={titleBox}>
            <Avatar alt='' src={notionIcon} sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Notion</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Link
              sx={link}
              href="https://www.notion.so/NextEvent-1c07fe1494a9803b9654d77c9a3b2955"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur Notion (ouvre dans un nouvel onglet)"
            >
              Se rendre sur Notion <OpenInNewIcon fontSize="small" />
            </Link>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <Avatar alt='' src={githubIcon} sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>GitHub</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Link
              sx={link}
              href="https://github.com/EpitechMscProPromo2026/T-ESP-800-project-71760-LYO_NextEvent"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur GitHub (ouvre dans un nouvel onglet)"
            >
              Se rendre sur GitHub (Epitech)<OpenInNewIcon fontSize="small" />
            </Link><br/>
            <Link
              sx={link}
              href="https://github.com/Yvan4001/esp_epitech_new_version"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur GitHub (ouvre dans un nouvel onglet)"
            >
              Se rendre sur GitHub (Yvan)<OpenInNewIcon fontSize="small" />
            </Link><br/>
            <Link
              sx={link}
              href="https://github.com/fatimabenzaoui/next-event-back"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur GitHub (ouvre dans un nouvel onglet)"
            >
              Se rendre sur GitHub (Fatima - BACK)<OpenInNewIcon fontSize="small" />
            </Link><br/>
            <Link
              sx={link}
              href="https://github.com/fatimabenzaoui/next-event-front"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur GitHub (ouvre dans un nouvel onglet)"
            >
              Se rendre sur GitHub (Fatima - FRONT)<OpenInNewIcon fontSize="small" />
            </Link>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <Avatar alt='' src={trelloIcon} sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Trello</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Link
              sx={link}
              href="https://trello.com/b/J7ErsoTK/esp-epitech"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur Trello (ouvre dans un nouvel onglet)"
            >
              Se rendre sur Trello <OpenInNewIcon fontSize="small" />
            </Link>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <Avatar alt='' src={figmaIcon} sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Figma</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Link
              sx={link}
              href="https://www.figma.com/design/kFpSeW6KBWDkYwElfxYiSm/NextEvent?node-id=62-1068&p=f&t=BWY4IVcjru8bLk6S-0"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              aria-label="Se rendre sur Figma (ouvre dans un nouvel onglet)"
            >
              Se rendre sur Figma <OpenInNewIcon fontSize="small" />
            </Link>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <AccountTreeIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>UML</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <img alt='events-class-diagram' src={eventsClassDiagram} />
            <img alt='students-class-diagram' src={studentsClassDiagram} style={{ marginLeft: 16 }} />
            <img alt='associations-class-diagram' src={associationsClassDiagram} style={{ marginLeft: 16 }} />
          </Typography>
          <Typography>
            <img alt='next-event-class-diagram' src={nextEventClassDiagram} />
            <img alt='users-class-diagram' src={usersClassDiagram} style={{ marginLeft: 16 }} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <ConstructionIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Specs techniques</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            DATABASE<br/>
              SQLITE3 - MYSQL<br/>
              NB : !!! de sqlite3 à mysql !!!<br/>
              supprimer __pycache et ttes les migrations dans le dossier migrations de l'application<br/>
              python manage.py makemigrations<br/>
              python manage.py migrate<br/>
              pip install mysqlclient<br/><br/>

            BACK<br/>
              - LANG : python<br/>
              - FRAMEWORK : django<br/><br/>
            
            FRONT<br/>
              - LANG : typeScript<br/>
              - FRAMEWORK : react.js<br/><br/>
            
            VSCODE<br/>
              - REST Client<br/>
              - SQLite IntelliView<br/>
              - Simple React Snippets<br/>
              - PlantUML<br/><br/>

            CONCEPTION<br/>
              - USER STORIES (Méthodes AGILES) :<br/>
            -	Orientation utilisateur : évitent les développements techniques déconnectés des besoins métier<br/>
            -	Clarté et simplicité : parce qu'elles sont courtes, facilitent la communication transversale<br/>
            -	Découpage fonctionnel et itératif : permettent un découpage fonctionnel du projet en éléments livrables<br/>
            -	Gestion des priorités : permettent de prioriser les fonctionnalités selon leur valeur métier<br/>
            -	Favorise la collaboration : favorisent la compréhension partagée des besoins<br/><br/><br/>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <CheckCircleIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Specs fonctionnelles</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            En tant quadministrateur, je veux ...<br/>
              - Gérer les évènements (CRUD)<br/>
              - Gérer les flyers (CRUD)<br/>
              - Gérer les adresses des évènements(CRUD)<br/>
              - Géolocaliser tous les évènements<br/>
              - Gérer les villes (CRUD)<br/>
              - Gérer les écoles (CRUD)<br/>
              - Gérer les adresses des écoles (CRUD)<br/>
              - Géolocaliser les écoles<br/>
              - Gérer les catégories (CRUD)<br/>
              - Gérer les associations (CRUD)<br/>
              - Gérer les étudiants (CRUD)<br/>
              - Gérer les utilisateurs (CRUD)<br/>
              - Gérer les roles (CRUD)<br/>
              - Gérer les photos des utilisateurs (CRUD)<br/><br/>

              - Afficher le nombre total d'évènements<br/>
              - Afficher le nombre total d'écoles<br/>
              - Afficher le nombre total d'évènements par mois<br/>
              - Afficher le nombre total d'évènements par ville<br/>
              - Afficher le nombre total d'évènements par école<br/>
              - Afficher le nombre total d'évènements par association<br/>
              - Afficher le nombre total d'évènements par catégorie<br/>
              - Afficher le top 5 des villes les plus actives<br/><br/><br/>
            En tant qu'internaute, je veux ...<br/>
              - Consulter la liste des évènements en cours et à venir<br/>
              - Consulter le détail d'un évènement<br/>
              - Consulter la liste des évènements en cours et à venir par ville<br/>
              - Consulter la liste des évènements en cours et à venir par école<br/>
              - Consulter la liste des évènements en cours et à venir par association<br/>
              - Consulter la liste des évènements en cours et à venir par catégorie<br/>
              - Consulter la liste des campus Epitech<br/>
              - Consulter la liste des associations Epitech<br/><br/>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* EVENTS API */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <ApiIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>API</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            EVENTS API<br/>
            # CRUD :<br/>
            GET - POST - PUT - PATCH - DELETE : /api/events/ - /api/events/&lt;id&gt;/<br/>
            GET : /api/events/current/<br/>
            GET - POST - PUT - PATCH - DELETE : /api/flyers/ - /api/flyers/&lt;id&gt;/<br/>
            GET - POST - PUT - PATCH - DELETE : /api/event-addresses/ - /api/event-addresses/&lt;id&gt;/<br/>
            GET - POST - PUT - PATCH - DELETE : /api/cities/ - /api/cities/&lt;id&gt;/<br/>
            GET : /api/geocode/?address=&lt;address&gt;<br/>
            GET - POST - PUT - PATCH - DELETE : /api/categories/ - /api/categories/&lt;id&gt;/<br/><br/>

            # ANALYTICS :<br/>
            GET : /api/events/count/<br/>
            GET : /api/events/by-month/<br/>
            GET : /api/events/count-by-city/<br/>
            GET : /api/events/count-by-school/<br/>
            GET : /api/events/count-by-association/<br/>
            GET : /api/events/count-by-category/<br/>
            GET : /api/events/top-5-cities/<br/><br/>

            # FILTRES :<br/>
            GET : /api/events/?city_id=&lt;id&gt;<br/>
            GET : /api/events/?school_id=&lt;id&gt;<br/>
            GET : /api/events/?association_id=&lt;id&gt;<br/>
            GET : /api/events/?category_id=&lt;id&gt;<br/><br/><br/>

            USERS API<br/>
            # CRUD :<br/>
            GET - POST - PUT - PATCH - DELETE : /api/users/ - /api/users/&lt;id&gt;/<br/><br/><br/>

            SCHOOLS API<br/>
            # CRUD :<br/>
            GET - POST - PUT - PATCH - DELETE : /api/schools/ - /api/schools/&lt;id&gt;/<br/>
            GET - POST - PUT - PATCH - DELETE : /api/school-addresses/ - /api/school-addresses/&lt;id&gt;/<br/>
            GET - POST - PUT - PATCH - DELETE : /api/cities/ - /api/cities/&lt;id&gt;/<br/>
            GET : /api/geocode/?address=&lt;address&gt;&lt;/address&gt;<br/><br/>
            # ANALYTICS :<br/>
            GET : /api/schools/count/<br/><br/><br/>

            ASSOCIATIONS API<br/>
            # CRUD :<br/>
            GET - POST - PUT - PATCH - DELETE : /api/associations/ - /api/associations/&lt;id&gt;/<br/><br/><br/>

            STUDENTS API<br/>
            # CRUD :<br/>
            GET - POST - PUT - PATCH - DELETE : /api/students/ - /api/students/&lt;id&gt;/<br/>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* DEPLOY */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Box sx={titleBox}>
            <RocketLaunchIcon sx={{ width: 36, height: 36 }} />
            <Typography sx={title}>Deploy</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
<p>
# FRONT<br/>
Installer gh-pages : npm i gh-pages<br/>
Modifier le package.json :<br/>
"homepage": "https://fatimabenzaoui.github.io/next-event-front"<br/>
"scripts": {'{'}<br/>
"predeploy": "npm run build",<br/>
"deploy": "gh-pages -d dist"<br/>
{'}'}<br/>
Lancer les commandes :<br/>
npm run predeploy (création du dossier "dist")<br/>
npm run deploy (publication sur gh-pages)<br/><br/>

Régler les routes :<br/>
- ajouter l'attribut basename à la balise BrowserRouter dans App.tsx : &lt;BrowserRouter basename="/next-event-front"&gt;<br/><br/>
- modifier vite.config.ts :<br/>
import {'{'} defineConfig {'}'} from 'vite';<br/>
import react from '@vitejs/plugin-react';<br/>

export default defineConfig({'{'}<br/>
  base: '/next-event-front/',<br/>
  plugins: [react()],<br/>
  build: {'{'}<br/>
    outDir: 'dist', // Dossier de sortie (par défaut pour Vite)<br/>
    emptyOutDir: true, // Nettoie le dossier avant chaque build<br/>
  {'}'},<br/>
{'}'});<br/><br/>
Régler les chemins des images<br/>
MARQUEUR DE LOCALISATION POUR LES CARTES<br/>
- déplacer les 3 images (marker-icon-2x.png - marker-icon.png - marker-shadow.png) 
du dossier node_modules/leaflet/dist/images/ dans le dossier public/img<br/>
- ajouter ce code pour les appeler :<br/>
import L from 'leaflet';<br/>

# corrige le chemin des icônes<br/>
const defaultIcon = L.icon({'{'}<br/>
  iconRetinaUrl: '/next-event-front/img/marker-icon-2x.png',<br/>
  iconUrl: '/next-event-front/img/marker-icon.png',<br/>
  shadowUrl: '/next-event-front/img/marker-shadow.png',<br/>
  iconSize: [25, 41],<br/>
  iconAnchor: [12, 41],<br/>
  popupAnchor: [1, -34],<br/>
  shadowSize: [41, 41],<br/>
{'}'});<br/>

# définit l'icône par défaut<br/>
L.Marker.prototype.options.icon = defaultIcon;<br/><br/>

AUTRES IMAGES<br/>
- déplacer les images dans le dossier public et modifier les src des images : src="/next-event-front/notion.png"<br/>
- ou s'assurer que celles-ci sont importées dans le code pour que Vite les copie dans dist/ :<br/>
import notionIcon from '../assets/notion.png'; et dans les src des images : src={'{'}notionIcon{'}'}<br/><br/><br/>



# BACK<br/>
- <a href="https://deploydjangopythonanywhere.vercel.app/" target="_blank">Guide d'hébergement Django & MySQL</a><br/>
- <a href="https://www.pythonanywhere.com/" target="_blank">Créer un compte sur pythonanywhere.com</a><br/><br/>

- Dans le Dashboard / Files / Cliquer sur Open Bash console here :<br/>
- cloner son dépôt : git clone https://github.com/next-event-back<br/>
- Créer et activer un environnement virtuel Python 3.13 : mkvirtualenv --python=/usr/bin/python3.13 venv<br/>
- Installer les packages nécessaires depuis requirements.txt : cd next-event-back puis pip install -r requirements.txt<br/><br/>

- Dans le dashboard / Web / Cliquer sur Add a new app<br/>
- Cliquer sur Next<br/>
- Sélectionner Manual configuration<br/>
- Sélectionner Python 3.13<br/>
- Cliquer sur Next<br/><br/>

- Configurer les chemins comme suit :<br/>
- Renseigner le chemin du Source code : /home/fatimabenzaoui/next-event-back<br/>
- Renseigner le chemin du Virtualenv : /home/fatimabenzaoui/.virtualenvs/venv/<br/><br/>

- Modifier le fichier WSGI :<br/>
import os<br/>
import sys<br/><br/>

path = '/home/fatimabenzaoui/next-event-back'<br/>
if path not in sys.path:<br/>
  sys.path.append(path)<br/>
os.environ['DJANGO_SETTINGS_MODULE'] = 'next-event-back.backend.settings'<br/>
from django.core.wsgi import get_wsgi_application<br/>
application = get_wsgi_application()<br/><br/>

- Configurer les fichiers static :<br/>
- Renseigner l'URL : /static/ et son chemin : /home/fatimabenzaoui/static<br/>
- Renseigner l'URL : /media/ et son chemin : 	/home/fatimabenzaoui/next-event-back/media<br/><br/>

- Activer https<br/>
- Cliquer sur Reload<br/><br/>


- Dans le dashboard / Cliquer sur l'onglet Databases / Créer une base de données<br/>
Modifier settings.py :<br/>
DATABASES = {'{'}<br/>
  'default': {'{'}<br/>
    'ENGINE': 'django.db.backends.mysql',<br/>
    'NAME': 'db_name',<br/>
    'USER': 'username',<br/>
    'PASSWORD': 'password',<br/>
    'HOST': 'host',<br/>
    'PORT': '3306',<br/>
  {'}'}<br/>
{'}'}<br/><br/>

- Appliquer les migrations dans la console Bash :<br/>
python manage.py makemigrations<br/>
python manage.py migrate app<br/><br/>

- Récupérer les fichiers static : python manage.py collectstatic puis cliquer sur Yes<br/><br/>

- Modifier settings.py :<br/>
DEBUG = False<br/>
ALLOWED_HOSTS = ['fatimabenzaoui.pythonanywhere.com']<br/>
CORS_ALLOWED_ORIGINS = ["https://fatimabenzaoui.github.io"]<br/><br/>

- Dans le dashboard / Web / Cliquer sur Reload
</p>       
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Documentation;

/** @type {import("@mui/material").SxProps} */
const titleBox = {
  display: 'flex',
  justifyContent: 'start',
  gap: 2,
  alignItems: 'center',
  width: '100%'
};

const title = {
  fontSize: '2rem'
}

const link = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
}
