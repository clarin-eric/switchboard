import alt from '../libs/alt';

export default alt.generateActions(
    'create',       'update',          'delete', 'reset',
    'attachToResource', 'detachFromResource',
    'updateMimetype', 'updateLanguage',
    'getResource'
);