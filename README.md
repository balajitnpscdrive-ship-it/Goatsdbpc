
# Don Bosco Polytechnic College - House Point System

A high-performance, responsive web application for managing House Points at DBPC. Featuring automated weekly resets, championship tracking, and merit certificate generation.

## 🚀 Key Features
- **Departmental Access**: Secure login for each department with unique security keys.
- **Automated Resets**: Weekly points reset every Wednesday at 10:00 AM automatically.
- **Topper Gallery**: Real-time identification of department and college-wide toppers.
- **Certificate System**: Generate high-resolution PDF/Printable merit certificates for winners.
- **CSV Import**: Admin can bulk-upload student name lists for easy selection.
- **Persistence**: All data is saved securely in the browser's local storage.

## 🛠 Deployment to GitHub Pages
1. Push this code to a new GitHub Repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, set Source to **GitHub Actions** or use the **Static** method if serving the raw `index.html`.
4. If using a build step, configure your workflow to run `npm run build` and deploy the `dist` folder.

## 🔐 Security Keys
- **Admin**: `Admin@DBPC`
- **Departments**: `{Dept}@DBPC` (e.g., `Mech@DBPC`, `CSE@DBPC`)

## 🎨 Tech Stack
- React 19 (ESM)
- Tailwind CSS
- Lucide Icons & Confetti API
- LocalStorage API
