'use strict'

const Model = use('Model')

class Customer extends Model {

    static get createdAtColumn(){
        return null;
    }

    static get updatedAtColumn(){
        return null;
    }

    bookings(){
        return this.hasMany('App/Models/Booking');
    }

    async getBookings(limit){
        return this.loadMany({
            bookings : (booking) => {
                if (typeof limit != "undefined"){
                    booking.limit(limit)
                }
                booking.orderBy('id', 'desc')
                .with('seats')
                .with('movie_showing_time', async (movie_showing_time) => {
                    movie_showing_time.select('id', 'movie_showing_id')
                    .with('movie_showing', (movie_showing) => {
                        movie_showing.select('id', 'cinema_id', 'room_id', 'movie_id')
                        .with('movie', (movie) => {
                            movie.select('id', 'movie_name').with('genres', (genres) => {
                                genres.select('id', 'genre_name')
                            })
                        })
                        .with('cinema', (cinema) => {
                            cinema.select('id', 'cinema_name', 'cinema_address', 'cinema_phone', 'cinema_seat_capacity')
                        })
                    })
                })
            }
        });
    }
}

module.exports = Customer
