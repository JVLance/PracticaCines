'use strict'

const Booking   =   use('App/Models/Booking');
const Seat      =   use('App/Models/Seat');
const Customer  =   use('App/Models/Customer');
const Database  =   use('Database');

class BookingController {

    async save ({response, request, auth}){
        const trx = Database.beginTransaction();

            const user      =   await auth.getUser();
            const customer  =   await customer.findBy('user_id', user.id);

            const seatsdata =   request.input('seats');

            const booking   =   await Booking.create({
                customer_id : customer.id,
                movie_showing_time_id : request.input('movie_showing_times_id'),
                booking_seat_count: seatsdata.length,
                booking_made_date : new Date()
            }, trx);

            let seats = [];

            seatsdata.forEach(current_seat => {
                const seat_row = current_seat.split('-');
                seats.push({
                    booking_id  : booking.id,
                    seat_row    : seat_row[0],
                    seat_number : seat_row[1],
                    seat_state  : "BOOKED"
                });
            });

            await Seat.createMany(seats, trx);

        trx.commit();

        return response.json({ res: 'ok' });
    }

    async last({response, auth}){
        const user      =   await auth.getUser();
        const customer  =   await customer.findBy('user_id', user.id);

        customer.getBookings(1);

        return response.json({ data : customer });
    }

    async all ({response, auth}){
        const user      =   await auth.getUser();
        const customer  =   await customer.findBy('user_id', user.id);

        customer.getBookings();

        return response.json({ data : customer });
    }
}

module.exports = BookingController
