What is GoGame?
I built this app to solve a simple problem: gamers in Batumi need a fast way to see if their favorite club has a free PC, and club owners need an easy way to manage those spots.

For Gamers (The Guest View)
Live Map: I used a dark-themed map of Batumi so users can find clubs easily.

Interior Previews: Before you book, you can see a photo of what the club actually looks like.

Seat Picker: You don’t just "book a spot"—you pick a specific PC on a grid. If it's red, it's taken; if it's green, it’s yours.

Simple Form: Just drop your name, number, and when you're coming. It saves everything in the browser so you don't lose your info if you refresh the page.

Admin Panel 
Private Logins: Each club (Elizeum, Portal, Controller) has its own login so they don't see each other's business.

Real-time Stats: A counter at the top shows exactly how many PCs are busy (like "5 out of 15").

Request List: When a gamer sends a request, it pops up in the admin panel. One click on "Approve" and that PC officially turns red on the map for everyone else.

Details on Hover: If an admin forgets who is sitting where, they can just hover over a PC to see the user's name and phone number.

 რა არის GoGame? 
ეს აპლიკაცია შევქმენი იმისთვის, რომ ბათუმელ გეიმერებს გაუმარტივდეთ ადგილის დაჯავშნა, ხოლო კლუბის მფლობელებს — ამ ჯავშნების მართვა.

მომხმარებელისთვის
ცოცხალი რუკა: გამოვიყენე ბათუმის რუკამ მარტივად პოულობ კლუბს ქალაქში.

ფოტოები: სანამ დაჯავშნი ხედავ კლუბის შიდა ინტერიერს.

ადგილის არჩევა: პირდაპირ სქემაზე ირჩევ იმ კომპიუტერს, რომელიც გინდა. თუ წითელია — დაკავებულია, თუ მწვანეა — შენი.

მონაცემების შენახვა: ყველაფერი ინახება ბრაუზერში, ასე რომ გვერდიც რომ დაარეფრეშო, ჯავშნები არ იკარგება.

ადმინისტრატორებისთვის (მართვის პანელი)
პირადი გვერდები: Elizeum-ს, Portal-ს და Controller-ს აქვთ თავიანთი ლოგინები

სტატისტიკა: ზემოთვე ჩანს რამდენი კომპიუტერია თავისუფალი 

ჯავშნების მიღება: როცა კლიენტი აგზავნის მოთხოვნას, ის მოდის სიაში. ერთი დაჭერით ადასტურებ და ის ადგილი რუკაზე ყველასთვის წითლდება.

ინფორმაცია მაუსის მიტანით: ადმინს შეუძლია მაუსი მიიტანოს დაკავებულ კომპიუტერთან და მაშინვე დაინახავს კლიენტის სახელს და ნომერს.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
