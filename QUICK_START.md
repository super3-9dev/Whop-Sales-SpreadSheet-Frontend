# 🚀 Quick Start Guide

## 1. Start the Backend Server
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:3000`

## 2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

## 3. Open Your Browser
Navigate to: `http://localhost:5173`

## 4. Execute the Complete Workflow

### Step 1: Create Product & Checkout Links
1. Click on **🛠️ Workflow** tab
2. Fill in the form:
   - **Product Title**: "My Test Product"
   - **Description**: "Test product for workflow demo"
   - **Number of Checkout Links**: 10
3. Click **🚀 Execute Complete Workflow**
4. Wait for completion (30-60 seconds)
5. Copy the internal names for tracking

### Step 2: Track Performance
1. Click on **🔍 Tracking** tab
2. Select an internal name from suggestions
3. Set date range (default: last 30 days)
4. Click **🔍 Track Receipts**
5. View the results

### Step 3: Generate Reports
1. Click on **📊 Reports** tab
2. Set date range for analysis
3. Click **📊 Generate Report**
4. Download Excel file

## 🎯 What You'll See

### Workflow Tab Results:
- ✅ Product created with ID
- ✅ 10 checkout links generated
- ✅ Internal names for tracking
- ✅ Random pricing ($10-$60)

### Tracking Tab Results:
- 📊 Receipt count by internal name
- 💰 Revenue tracking
- 👥 Customer information
- 📅 Date and status details

### Reports Tab Results:
- 📈 Summary statistics
- 💵 Total sales and revenue
- 📥 Excel file download
- 📊 Daily sales breakdown

## 🔧 API Endpoints Used

The frontend integrates with these backend endpoints:
- `POST /api/complete-workflow` - Create product + checkout links
- `POST /api/track-checkout-links` - Track by internal name
- `POST /api/generate-report` - Generate sales reports
- `GET /api/download/:filename` - Download Excel files

## 🎨 UI Features

- **Tabbed Navigation**: Switch between Workflow, Reports, and Tracking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: User-friendly error messages
- **Interactive Elements**: Clickable suggestions and tags

## 🚨 Troubleshooting

### Backend Issues:
- Check if backend is running on port 3000
- Verify API key configuration
- Check console for error messages

### Frontend Issues:
- Check if frontend is running on port 5173
- Verify backend connection
- Check browser console for errors

### API Issues:
- Ensure Whop API credentials are correct
- Check network connectivity
- Verify API rate limits

## 📱 Mobile Usage

The interface is fully responsive:
- Use tabs to navigate between features
- Forms adapt to mobile screens
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🎯 Next Steps

1. **Customize Product Details**: Modify titles and descriptions
2. **Adjust Checkout Count**: Create more or fewer links
3. **Track Different Names**: Monitor various internal names
4. **Generate Regular Reports**: Set up periodic analytics
5. **Scale Up**: Create multiple products and campaigns

## 🔗 Useful Links

- Backend API Documentation: `backend/WORKFLOW_README.md`
- Frontend Guide: `frontend/WORKFLOW_GUIDE.md`
- Test Script: `backend/test-workflow.js`

Enjoy using the Whop Complete Workflow Manager! 🎉
