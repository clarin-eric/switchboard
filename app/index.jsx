import './css/main.css';
import './css/accordion.css';
import './css/selectize.css';
import './css/ionicons.min.css';

import './css/vlo.css';
import './css/toggle.css';


import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

persist(alt, storage, 'app');

ReactDOM.render(<App />, document.getElementById('app'));
