const mongoose = require('mongoose')
const Song = require('./song')
const db = require('../../config/db')

const startSongs = [
    { title: '#1 May Nothing Evil Cross This Door', composer: 'Robert N. Quaile', lyricist: 'Louis Untermeyer', type: 'Hymn #1',
    lyrics: '|`|May nothing evil cross this door,|and may ill fortune never pry about|these windows; may the roar|and rain go by.| `|By faith made strong, the rafters will|withstand the battering of the storm.|This hearth, though all the world grow chill,|will keep you warm.|`|Peace shall walk softly |through these rooms,|touching our lips with holy wine,|till every casual corner blooms|into a shrine.|`|With laughter drown the raucous shout,|and, though these sheltering walls are thin,|may they be strong to keep hate out|and hold love in.',
    scorePDF: '', recordings: 'jobim', embedId: "C4rSAIts3MA", owner: '63019e76310352fced45f3b7'},
    { title: '#2 Down the Ages We Have Trod', composer: 'THOMAS (TOM) BENJAMIN', lyricist: 'JOHN ANDREW STOREY', type: 'Hymn #2',
    lyrics: '',
    scorePDF: '', recordings: 'chopin', owner: '63019e76310352fced45f3b7'},
    { title: '#3 The World Stands Out on Either Side', composer: 'W. FREDERICK WOODEN', lyricist: 'Edna St. Vincent Millay', type: 'Hymn #3',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#4 I Brought My Spirit to the Sea ', composer: 'Alec Wyton', lyricist: 'MAX KAPP', type: 'Hymn #4',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#5 It Is Something to Have Wept', composer: 'ROBERT L. SANDERS', lyricist: 'Gilbert Keith Chesterton', type: 'Hymn #5',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#6 Just as Long as I Have Breath ', composer: 'Johann G. Ebeling', lyricist: 'ALICIA S. CARPENTER', type: 'Hymn #6',
    lyrics: '',
    scorePDF: '', recordings: 'https://www.youtube.com/watch?v=-e_233Td-0o', embedId: '-e_233Td-0o', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#7 The Leaf Unfurling', composer: 'John Corrado', lyricist: 'DON COHEN', type: 'Hymn #7',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#8 Mother Spirit, Father Spirit', composer: 'NORBERT ČAPEK (Capek)', lyricist: 'NORBERT ČAPEK (Capek), RICHARD FREDERICK BOEKE', type: 'Hymn #8',
    lyrics: '',
    scorePDF: '', recordings: 'https://www.youtube.com/watch?v=rBmU_uj7i18', embedId: 'rBmU_uj7i18', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: '#9 No Longer Forward or Behind', composer: 'English Folk Song', lyricist: 'JOHN GREENLEAF WHITTIER', type: 'Hymn #9',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'}
    // { title: '', composer: '', author: '', type: '',
    // lyrics: '',
    // scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
]

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        //to only delete songs without an owner pass in {owner: null}
        Song.deleteMany()
            .then(deletedSongs => {
                console.log('deletedSongs', deletedSongs)
                Song.create(startSongs)
                    .then(newSongs => {
                        console.log('the new songs', newSongs)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })