# Murple
A *✨reimagined ✨* Google Classroom experience.

# THIS PROJECT IS NOW ARCHIVED
Murple was a project I worked on extensively the summer of 2020 during my long days in quarantine. I had a big plan for what would ultimately be a Google Classroom companion application, but when I finally got caught up in my own schoolwork, I found that it probably wouldn't be as useful as I had initially expected.

Below are all of initial plans for the project and the ideas behind the design. This readme was much more a checklist/design document for me than anything. The project has since been abandoned.

# Context

School closures and distance learning have presented students with a slew of new challenges related to school. Besides desperately trying to stay motivated to complete schoolwork and dealing with the difficulty of social isolation, students must keep track of assignments, follow their changing virtual class schedules, and interact with multiple learning platforms for each class. 

Google Classroom creates a space to house all assignments and forms a simple workflow as it is connected with Drive. However, taking more than class at once can make managing and balancing all the work a bit difficult. Having to scroll through a bunch of crowded class streams, keeping track of and submitting many assignments, having your email blown up with new assignment emails— things can get overwhelming.

# Problems

### Main issues to address

- Classroom's built-in to-do system is very limited. There is no way to hide or organize assignments (ones that may be optional for example) or to set up custom reminders for work or announcements. This is especially problematic when a student falls behind, as there are no reminders for work past the due date.
- The stream display format for classes is not ideal because important assignments/announcements (e.g. Zoom links or long-term assignment details) can get lost in the crowded list of posts.
- The classroom homepage has very minimal customization and does not display enough useful data for students who want to get a sense of what they have to do for the day at a glance. In addition, the grid organization is fairly limiting and doesn’t provide a good way to visually distinguish sections.s

### Peer complaints

Upon surveying some students, these are the most common complaints about Google Classroom. These also should be addressed through the structure and features of this web app.

- Classes can't easily be ordered or hidden in an intuitive way.
- On personal devices, Classroom always defaults to the student's personal account rather than school email, which requires an annoying extra step.

# Design Goals

1. Reimagine Classroom's organizational structure without adding any breaking compatibility changes with the existing Classroom system.
2. Create a streamlined interface that is usable and intuitive especially for students coming from Google Classroom "native" or who may be less familiar with computers.
3. Make more information available to students at a glance (on homepage and in course pages) with widgets.
4. Improve assignment reminders to help students manage assignments and work alongside their own time management system.

---

# Dependencies

This project will rely heavily on the Google Classroom API and OAuth2 for user authentication.

### Classroom API Documentation

[Authorizing Requests | Classroom API | Google Developers](https://developers.google.com/classroom/guides/auth)

### NextAuth

Login and sessions will be handled by a Next.js authentication library, NextAuth. The server-side library uses JSON Web Tokens to store user credentials as well as user data in a database.

[NextAuth.js](https://next-auth.js.org)

### Next.js + React

Next.js is a React.js framework that implements server-side rendering. This allows for the bulk of the program (API fetches, database calls, styling) to be handled on the server side, leaving minimal Javascript to run on the client. This makes initial loading time marginally slower, but improves site performance and security in the long run.

[Next.js by Vercel - The React Framework](https://nextjs.org)

# Security

## ICTS

To my surprise, in testing so far, I have not received an email from the automated ICTS system indicating that I had given an unauthorized application access to my account. However, I suspect that the app will need to be approved by the school before the release.

> "Admins can restrict whether teachers and students in their domain can authorize apps to access their Google Classroom data."

[https://developers.google.com/classroom/guides/get-started](https://developers.google.com/classroom/guides/get-started)

## Google API Permissions

The following “scopes” are the Classroom API permissions the app will use:

- `classroom.courses.readonly`
    - This permission gives the app access to the courses the user is enrolled in.
- `classroom.coursework.me.readonly`
    - Provides read-only access to the student's assignment details from the classes they are enrolled in. This does not give the app access to their work, only the status of the assignment and links to any attachments that come with it.
    - The intent of the app is to replace the interface of Classroom, but it will not replace the assignment submission/post interaction features. To submit assignments and comment on the posts, users will have to visit the standard site.
- `classroom.announcements.readonly`
    - This permission gives the app the ability to read announcements from the classes the student is enrolled in.
    - These will be displayed in the appropriate class “streams” (name pending)

All user data will be stored as described in section "Database Structure". The database is hosted in MongoDB Atlas, an affordable remote database service. All user data will be encrypted.

# Explore

## Data flow

TODO: Redraw flow diagram with nextjs 

## Database Structure

The plan is for this app to utilize a server-side MongoDB NoSQL database to store data. 

- User
    - Classes (keyed by unique ID)
        - App-generated class metadata
            - Link to classroom page
            - Class color
            - Class nickname
            - Class tags (user defined description)
            - Teachers
        - Stream contents
            - Posts
                - Post Type (announcement/assignment)
                - Reminder data (cron job id)
                - Latest raw classroom api request data
                - Pinned (boolean)

## Processing DB data & page structure

Database will refresh every *n* seconds or so to get the most up to date classroom data. With that data, the following pages will be generated.

These pages will be available in the initial release:

### Homepage

- Structure will be similar to current Google Classroom interface but provide more data in the form of class "widgets". Widgets may be classes, progress indicators, todo lists, reminder data, etc.
- Users can create collapsible class categories, “folders”, and reorder them as well as the classes within them.
- Each class widget will display...
    - Number of assignments they have left
    - A progress bar of how many assignments they have left before being fully up to date.
    - A badge depicting how many new assignments/announcements have been added.

### Class pages

- Assignments and announcements will have separate streams to organize the class page.
- Both assignments and announcements can be pinned to the top of their streams in visually separated lists.
- All assignments and announcements will be linked to their native classroom counterparts. If a student wants to interact with the assignment (such as by commenting or submitting work, they should do so through the default app. This will be handled automatically by the links in the website.)

### To-do page

The "to-do" page will be later implemented but will just be another section of the database that stores assignment id's and text reminders that users can create themselves.

- Students can put assignments and announcements in a separate to-do list that can be configured to automatically update with new assignments as they are posted, but also can contain student-entered entries.
- Students can configure email reminders to be sent at a single time or multiple times before the assignment is due.

---
