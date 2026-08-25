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