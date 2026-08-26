1. **Setup Instructions**: Clear steps to run your application

2. **Implementation Notes**: Brief overview of your approach and architecture decisions

3. **Design Decisions**: Explain key technical choices you made and why

4. **Challenges**: Any interesting problems you solved or obstacles you encountered

5. **Additional Features**: If you implemented bonus features or went beyond requirements, explain what and why

So, this will be my free thoughts on everything. First things first, I gotta check out the times. I've already ran the development servers, everything seems to be running well and done. Yeah, I just needed to go read the types files and then start working on the back end. I guess a challenge would be that this is my first time actually developing in an front end and back end separate made me realize that I may have been writing my full stack a bit incorrectly or differently, but this is an experience, so it should be fun.

Alright, I finished reading the types that he has filed and then to answer the question about orders having customer information now, customer information should be separate from an order and they should be connected via a reference of the customer ID. The reason why it's not a good idea to embed the customer data directly is because of future system which might require customer information and you don't want to also send extra information such as the orders and it would also also since every order would be considered new it would have to resend customer data again and again and it's a bit redundant

As of now, I've created a customer interface and updated all the interfaces that require customer information

I've added the Postgres Docker Compose. I have also add adminer to view the database

I've added the Prisma models and enums for the schema for the Postgres to reflect what we currently have on the types.ts file

I deployed Persmona to my DB has generated a migration file. everything looks well I think we're gonna move on to implementing the rest of the stuff I believe I'll have to check the README file again to make sure that I all the types and items are finished before starting with the API

Alright, so Prisma files have been generated. Now we'll look into the API or the REST or the REST API implementation

Add the the REST API for orders took a bit longer than expected but got it working. working on implementing or importing the test data or demo data into the database

Alright we added the seeded data into the database and I've tested out the get works now just to finish up the rest of the API

I finished implementing the REST API for orders and I was also going to implement one for customers since I separated customers from the order

Working on the front end right now I just created a simple front-end UI for fetching the data from the backend in order to ensure that the everything is working fine and as expected

Alright, so first of all, I need to think about this in the perspective of a restaurant owner. I think if I wanted to go the best experience to customers, I would have to ensure the orders first of all get added to the dashboard. I think I would like to add some kind of timer system where basically it ensures that older orders get priority on what needs to be done. Kind of like a more like a timer, just saying how long they've been waiting for, and then after X amount of time, it goes to red and be like, in this customer has been waiting for their order and it needs to get done soon. I think I would like to implement a first come, first serve type of queue system. I feel like that would be the best. That way, the customers that have already ordered their food can get their food quick and fast. But of course, we can bypass this in case one customer comes and they order something that's basically already available. Like maybe, maybe it's a fast food, maybe like french fries. French fries is probably subir easy to just take it out and give it to the customer, but yeah, but for most of it, I think I do want to make a first come first serve queue system

I think for orders I want to add like a button that allows the owner just to quickly go to the next face on the status of the food but also have the option for the drop-down in case they do need it so I'll have to see how I'll make that look

For creating orders, I think I might try to I will I think I'm making a customer view and then the restaurant view of course will allow this door to make the orders also so I think I need like a cashier view a customer view and a restaurant view in order to get all the main views out there

Finish adding a simple router system. Also, added cache of your customer view and then the kitchen view

Kind of start on the core requirement, which is basically displaying the informat. And also creating the filtering system

Added a skeleton UI for the loading and added error handling

You worked on having a better system for the queue system and a search system, plus a improved filtering and sorting system.
I just want to make sure that I had all the information needed. I think next I'm thinking of working into like a way for the restaurant owner to be able to move an order from its current state to the next state. I think the simplest implementation will be adding a button

Alright, I added the buttons and verified that the buttons actually update the actual status of the item

working on better way to see the full details of the menu items. Current design is basically clicking on the cart and opening a panel with all the information on it.

I think kitchen-wise it's almost everything ready. I think I just need analytics
I think we can do something simple just to see how many words are in queue revenue I think any major or how many items or menus needs to I guess how many orders need to be prioritized at the moment. I think and a way to know what the current queue time or wait time is like an average or something like that

So I just come to the realization that I'm gonna have a problem because I do not have a menu system on the database. So either I can create a new schema for menu or maybe I can just like create a type and just do it all locally Which would be easier I think I'm gonna explore first the schema and how that would work and depending on how much work it is I'll see what to do from there.

Alright, based on the current data set. I don't think it would be possible to actually make a menu system because then now I had to redo the database because of the fact that order items do not have a unique factor for the name of the item therefore I would have to change a lot of things which would not be productive or ideal so I think I'm just fake create like a fake menu system and then keep the current schema yeah that's how we'll implement it.

Yeah, so I had to just create a fake menu. I've added a card system and yeah create a customers to be attached to that

Alright, so now all that's left is creating the customer earning system for online orders, which I think should be easy because then I can just reuse stuff from the cashier view since, in a sense, it's kind of almost the same thing, but I think I want to use email first that way since email is unique, we could automatically get the client's information. If not, they'll just create a new one. Maybe have something like, oh, found you, or look up accounts or create accounts with you. But yeah Something simple, not too complicated, no no authentication system or nothing like that. That'd be over scope for sure

So the order wait time based on my personal experience has always been between 15 and 20, so I'm just gonna default 15 to 20 for clients estimated time on order to be ready for pick up

Alright, so in my original plan I wanted to get or autofill the data based on the email but I think we have to create API backend for this which I haven't done so I don't know if I want to do that I mean I think it should be pretty simple shouldn't take that too long I'll see I'll think about it yeah yeah I think I think it should be I think it might be easy

Okay, I want to kind of implement the point system also into the checkout page I've never done the point system so I'm not sure what is a good point system so I'm doing a thousand points is equivalent to a dollar and every dollar they spent is equal to one point for example ten dollars would be ten points I hope that this is a good point system. Gonna still need an API for the point system, I think

Alright, I'll start implementing order updates with the websockets so i can be real time. hope it work outs.

Test of websocket is working. now need to make it look better.

The next step will probably to try to get this in an actual production ready server. I will use Docker Compose for this. 

I got the docker compose to work locally but also found out I forgot to redirect users to order tracking. It was an oversight because I using a direct link on browser to check lol.

Alright, so everything is working locally. Now just have to test it in production. Hopefully it works

Of course production is not working and hopefully changing the ports about I have to change it because my VPS is already using the other ports.


And I broke production. was trying to fix ERR_BLOCKED_BY_CLIENT

Reverting change in order to fina an other solution. 

Issue was on my part on the back end for the VPS. I had to create an isolated environment for this. 

