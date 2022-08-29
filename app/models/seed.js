const mongoose = require('mongoose')
const Song = require('./song')
const db = require('../../config/db')

const startSongs = [
    { title: 'May Nothing Evil Cross This Door #1', composer: 'Robert N. Quaile', lyricist: 'Louis Untermeyer', type: 'Hymn',
    lyrics: '|`|May nothing evil cross this door,|and may ill fortune never pry about|these windows; may the roar|and rain go by.| `|By faith made strong, the rafters will|withstand the battering of the storm.|This hearth, though all the world grow chill,|will keep you warm.|`|Peace shall walk softly |through these rooms,|touching our lips with holy wine,|till every casual corner blooms|into a shrine.|`|With laughter drown the raucous shout,|and, though these sheltering walls are thin,|may they be strong to keep hate out|and hold love in.',
    scorePDF: '', recordings: 'jobim', embedId: "C4rSAIts3MA", owner: '63019e76310352fced45f3b7'},
    { title: 'Down the Ages We Have Trod #2', composer: 'THOMAS (TOM) BENJAMIN', lyricist: 'JOHN ANDREW STOREY', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: 'chopin', owner: '63019e76310352fced45f3b7'},
    { title: 'The World Stands Out on Either Side #3', composer: 'W. FREDERICK WOODEN', lyricist: 'Edna St. Vincent Millay', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'I Brought My Spirit to the Sea #4', composer: 'Alec Wyton', lyricist: 'MAX KAPP', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'It Is Something to Have Wept #5', composer: 'ROBERT L. SANDERS', lyricist: 'Gilbert Keith Chesterton', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'Just as Long as I Have Breath #6', composer: 'Johann G. Ebeling', lyricist: 'ALICIA S. CARPENTER', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: 'https://www.youtube.com/watch?v=-e_233Td-0o', embedId: '-e_233Td-0o', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'The Leaf Unfurling #7', composer: 'John Corrado', lyricist: 'DON COHEN', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: '', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'Mother Spirit, Father Spirit #8', composer: 'NORBERT ČAPEK (Capek)', lyricist: 'NORBERT ČAPEK (Capek), RICHARD FREDERICK BOEKE', type: 'Hymn',
    lyrics: '',
    scorePDF: '', recordings: 'https://www.youtube.com/watch?v=rBmU_uj7i18', embedId: 'rBmU_uj7i18', owner: '63019b25ae6e795c6c8e9eb7'},
    { title: 'No Longer Forward or Behind #9', composer: 'English Folk Song', lyricist: 'JOHN GREENLEAF WHITTIER', type: 'Hymn',
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