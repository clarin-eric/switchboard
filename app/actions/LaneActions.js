import alt from '../libs/alt';

export default alt.generateActions(
    'create',       'update',          'delete', 'reset',
    'attachToLane', 'detachFromLane',
    'addFilename',  'addMimetype',     'addLanguage', 'getLane'
);