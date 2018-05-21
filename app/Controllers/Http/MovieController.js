'use strict'

const Cinema        =   use('App/Models/Cinema');
const MovieShowing  =   use('App/Models/MovieShowing');
const moment        =   require('moment');

class MovieController {

    async byCinema({response, params}) {
        
        const cinema = await Cinema.find(params.cinemaId);
        await cinema.getInfo(false);

        return response.json({ data : cinema });
    }

    async byMovie({response, params}){

        const movie = await MovieShowing.findBy('movie_id', params.movieId);
        await movie.getInfo();
        
        return response.json(movie);
    }
}

module.exports = MovieController
