
var session = {};
session.newSessions = [],
    session.joinSession = [];

exports.createSessionRoom = function (io, id, socket_id, name) {
    if (session.newSessions.length > 0 && session.newSessions.indexOf(id) !== -1) {
        session.joinSession.forEach(function (v) {
            if (id === v.id && io.sockets.connected[v.socket_id]) {
                io.sockets.connected[v.socket_id].emit(v.id, {type: 'new', joiners: v.joiners, details: v.details});
            }
        });
    } else {
        session.newSessions.push(id);
        session.joinSession.push({
            socket_id: socket_id,
            id: id,
            name: name,
            joiners: [id],
            details: [{id:id, name: name}],
            video: [],
            videoUrls : [],
            messages: true
        });
        io.sockets.connected[socket_id].emit(id, {type: 'new', joiners: [id], details: [{id:id, name: name}]});
    }
};

exports.joinSessionRoom = function (io, id, socket_id, name, session_id) {
    if (session.newSessions.length > 0 && session.newSessions.indexOf(id) !== -1) {
        session.joinSession.forEach(function (v) {
            if (id === v.id && io.sockets.connected[v.socket_id]) {
                io.sockets.connected[v.socket_id].emit(v.id, {type: 'join', joiners: v.joiners, details: v.details});
            }
        });
    } else {
        session.newSessions.push(id);
        session.joinSession.forEach(function (v) {
            if (v.id === session_id  && io.sockets.connected[v.socket_id]) {
                v.joiners.push(id);
                v.details.push({id: id, name: name});
                io.sockets.connected[v.socket_id].emit(v.id, {type: 'join', joiners: v.joiners, details: v.details});
                session.joinSession.push({
                    socket_id: socket_id,
                    id: id,
                    name: name,
                    joiners: v.joiners,
                    details: v.details,
                    video: [],
                    videoUrls : [],
                    messages: true
                });
                io.sockets.connected[socket_id].emit(id, {type: 'join', joiners: v.joiners, details: v.details});
            }
        });
        session.joinSession.forEach(function (v) {
            if (v.id !== session_id && v.id !== id && v.joiners.indexOf(session_id) !== -1 && io.sockets.connected[v.socket_id]) {
                io.sockets.connected[v.socket_id].emit(v.id, {type: 'join', joiners: v.joiners, details: v.details});
            }
        });
    }
};

exports.messages = function (io, id, message) {
    session.joinSession.forEach(function (viewers) {
        if (viewers.id === id) {
            session.joinSession.forEach(function (joiners) {
                viewers.joiners.forEach(function (myJoiners) {
                    if (joiners.id !== id && joiners.id === myJoiners && io.sockets.connected[joiners.socket_id]) {
                        io.sockets.connected[joiners.socket_id].emit(joiners.id, {
                            type: 'text-message',
                            response: message
                        });
                    }
                });
            });
        }
    });
};

exports.isTyping = function(io,id,name) {
    session.joinSession.forEach(function (viewers) {
        if (viewers.id === id) {
            session.joinSession.forEach(function (joiners) {
                viewers.joiners.forEach(function (myJoiners) {
                    if (joiners.id !== id && joiners.id === myJoiners && io.sockets.connected[joiners.socket_id]) {
                        io.sockets.connected[joiners.socket_id].emit(joiners.id, {
                            type: 'isTyping',
                            name: name
                        });
                    }
                });
            });
        }
    });
};

exports.videoConference = function (io,id,blob) {
    session.joinSession.forEach(function (viewers) {
        if (viewers.id === id) {
            session.joinSession.forEach(function (joiners) {
                viewers.joiners.forEach(function (myJoiners) {
                    if (joiners.id !== id && joiners.id === myJoiners && io.sockets.connected[joiners.socket_id]) {
                        if(joiners.video.indexOf(id) === -1){
                            joiners.video.push(id);
                            joiners.videoUrls.push({id:id,blob:blob});
                        }
                        io.sockets.connected[joiners.socket_id].emit(joiners.id, {
                            type: 'video',
                            videos:joiners.videoUrls
                        });
                    }
                });
            });
        }
    });
};

exports.nameChange = function (io, id, name) {
    session.joinSession.forEach(function (viewers) {
        viewers.details.forEach(function(d){
            if(d.id === id){
                d.name = name;
                io.sockets.connected[viewers.socket_id].emit(viewers.id, {type: 'join', joiners: viewers.joiners, details:viewers.details});
            }
        });
    });
};

exports.sessionWatch = function (io) {
    session.joinSession.forEach(function (viewers, index) {
        if (!io.sockets.connected[viewers.socket_id]) {
            session.joinSession.forEach(function (allJoiners) {
                viewers.joiners.forEach(function (myJoiners) {
                    if (allJoiners.id === myJoiners && io.sockets.connected[allJoiners.socket_id]) {
                        allJoiners.details.forEach(function (removeDetails, removeIndex) {
                            if (removeDetails.id === viewers.id) {
                                allJoiners.details.splice(removeIndex, 1);
                                allJoiners.joiners.splice(allJoiners.joiners.indexOf(viewers.id), 1);
                            }
                        });
                        io.sockets.connected[allJoiners.socket_id].emit(allJoiners.id, {
                            type: 'join',
                            joiners: allJoiners.joiners,
                            details: allJoiners.details
                        });
                    }
                });
            });
            session.joinSession.splice(index, 1);
        }
    })
};

