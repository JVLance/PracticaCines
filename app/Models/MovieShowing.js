'use strict'

const Model = use('Model')

class MovieShowing extends Model {

    static get createdAtColumn(){
        return null;
    }

    static get updatedAtColumn(){
        return null;
    }

    movie(){
        return this.belongsTo('App/Models/Movie');
    }

    movie_showing_times(){
        return this.belongsTo('App/Models/MovieShowingTime');
    }

    room(){
        return this.belongsTo('App/Models/Room');
    }

    cinema(){
        return this.belongsTo('App/Models/Cinema');
    }

    async getInfo(){
        return this.loadMany({
            movie_showing_times : (movie_showing_times) => {
                movie_showing_times
                .where('hour_to_show', '>=', new Date().getHours())
                .with('bookings', (bookings) => {
                    bookins.with('seats')
                })
            },
            movie : (movie) => {
                movie.with('genres', (genres) => {
                    genres.select('genre_name')
                })
            },
            room : null
        });
    }
}

module.exports = MovieShowing
