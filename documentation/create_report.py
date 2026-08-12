from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether
)

OUTPUT = "Military_Asset_Management_Report.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=45,
    leftMargin=45,
    topMargin=45,
    bottomMargin=45
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleCustom",
    parent=styles["Title"],
    fontSize=22,
    leading=28,
    alignment=TA_CENTER,
    spaceAfter=20
)

subtitle_style = ParagraphStyle(
    "SubtitleCustom",
    parent=styles["Normal"],
    fontSize=12,
    leading=18,
    alignment=TA_CENTER,
    spaceAfter=30
)

heading_style = ParagraphStyle(
    "HeadingCustom",
    parent=styles["Heading1"],
    fontSize=16,
    leading=20,
    spaceBefore=16,
    spaceAfter=10
)

subheading_style = ParagraphStyle(
    "SubHeadingCustom",
    parent=styles["Heading2"],
    fontSize=12,
    leading=16,
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    "BodyCustom",
    parent=styles["BodyText"],
    fontSize=9.5,
    leading=15,
    spaceAfter=8
)

small_style = ParagraphStyle(
    "SmallCustom",
    parent=styles["BodyText"],
    fontSize=8,
    leading=11
)

story = []


def p(text, style=body_style):
    story.append(Paragraph(text, style))


def heading(text):
    story.append(Paragraph(text, heading_style))


def subheading(text):
    story.append(Paragraph(text, subheading_style))


def spacer(height=8):
    story.append(Spacer(1, height))


def bullet(text):
    story.append(
        Paragraph(
            "• " + text,
            body_style
        )
    )


# ============================================================
# COVER PAGE
# ============================================================

story.append(Spacer(1, 100))

story.append(
    Paragraph(
        "MILITARY ASSET MANAGEMENT SYSTEM",
        title_style
    )
)

story.append(
    Paragraph(
        "Enterprise Asset Tracking and Management Application",
        subtitle_style
    )
)

story.append(Spacer(1, 20))

story.append(
    Paragraph(
        "<b>Project Documentation Report</b>",
        ParagraphStyle(
            "Cover",
            parent=styles["Normal"],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=12
        )
    )
)

story.append(
    Paragraph(
        "Developed by: Bhavya",
        ParagraphStyle(
            "CoverName",
            parent=styles["Normal"],
            fontSize=12,
            alignment=TA_CENTER
        )
    )
)

story.append(Spacer(1, 180))

story.append(
    Paragraph(
        "Full-Stack Web Application",
        subtitle_style
    )
)

story.append(PageBreak())


# ============================================================
# 1. PROJECT OVERVIEW
# ============================================================

heading("1. Project Overview")

p(
    "The Military Asset Management System is a full-stack web application "
    "designed to manage and track military assets across multiple bases. "
    "The application provides functionality for managing assets, purchases, "
    "cross-base transfers, personnel assignments, expenditures, dashboard "
    "metrics, authentication, role-based access control, and audit records."
)

p(
    "The system uses a React-based frontend and a Node.js/Express backend "
    "connected to a PostgreSQL relational database. JWT-based authentication "
    "is used to protect authenticated API operations, while role-based "
    "authorization controls access to protected operations."
)


# ============================================================
# 2. OBJECTIVES
# ============================================================

heading("2. Project Objectives")

bullet("Provide centralized visibility of military assets across multiple bases.")
bullet("Maintain asset quantities by base and equipment type.")
bullet("Record purchases and incoming stock.")
bullet("Track transfers between military bases.")
bullet("Record personnel assignments.")
bullet("Record asset expenditures.")
bullet("Provide dashboard information for inventory movements.")
bullet("Protect APIs using JWT authentication.")
bullet("Enforce role-based access control.")
bullet("Maintain audit records for important asset-changing operations.")
bullet("Use PostgreSQL relational constraints to maintain data integrity.")


# ============================================================
# 3. TECHNOLOGY STACK
# ============================================================

heading("3. Technology Stack")

stack_data = [
    ["Layer", "Technology"],
    ["Frontend", "React, Vite, CSS"],
    ["HTTP Client", "Axios"],
    ["Backend", "Node.js, Express.js"],
    ["Authentication", "JSON Web Token (JWT)"],
    ["Authorization", "Role-Based Access Control (RBAC)"],
    ["Security", "Helmet, CORS"],
    ["Database", "PostgreSQL"],
    ["Database Hosting", "Neon PostgreSQL"],
    ["Backend Hosting", "Render"],
    ["Frontend Hosting", "Vercel"],
    ["Version Control", "Git and GitHub"],
    ["API Testing", "Postman / API testing tools"],
]

table = Table(stack_data, colWidths=[1.5 * inch, 4.5 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#f3f4f6")]),
        ("PADDING", (0, 0), (-1, -1), 6),
    ])
)

story.append(table)


# ============================================================
# 4. SYSTEM ARCHITECTURE
# ============================================================

heading("4. System Architecture")

p(
    "The application follows a client-server architecture. The React frontend "
    "communicates with the Express backend through REST API endpoints. The "
    "backend handles authentication, authorization, business operations, "
    "database queries, and audit logging."
)

architecture_data = [
    ["Layer", "Responsibility"],
    ["React Frontend", "User interface, forms, dashboard and navigation"],
    ["Axios API Client", "Communicates with backend REST APIs and sends JWT"],
    ["Express Backend", "Routing, controllers, authentication and business logic"],
    ["JWT Middleware", "Validates authentication tokens"],
    ["RBAC Middleware", "Checks permitted user roles"],
    ["PostgreSQL", "Stores users, bases, assets and transaction records"],
    ["Neon", "Cloud PostgreSQL database hosting"],
    ["Render", "Backend API deployment"],
    ["Vercel", "Frontend deployment"],
]

table = Table(architecture_data, colWidths=[1.7 * inch, 4.3 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#f3f4f6")]),
        ("PADDING", (0, 0), (-1, -1), 6),
    ])
)

story.append(table)


# ============================================================
# 5. USER ROLES AND RBAC
# ============================================================

heading("5. User Roles and Role-Based Access Control")

p(
    "The system supports three user roles: ADMIN, BASE_COMMANDER and "
    "LOGISTICS_OFFICER. User roles are stored in the users table and are "
    "included in the authenticated JWT information."
)

rbac_data = [
    ["Role", "Purpose"],
    ["ADMIN", "Global administrative access to system operations."],
    ["BASE_COMMANDER", "Base-level management operations such as assets, assignments and expenditures."],
    ["LOGISTICS_OFFICER", "Operational management of purchases and transfers."],
]

table = Table(rbac_data, colWidths=[2 * inch, 4 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 6),
    ])
)

story.append(table)

subheading("Authentication Flow")

p(
    "When a protected endpoint is requested, the authentication middleware "
    "reads the Authorization header and expects a Bearer token. The JWT is "
    "verified using the configured JWT secret. The decoded user information "
    "is then attached to req.user."
)

subheading("Authorization Flow")

p(
    "The authorizeRoles middleware receives the allowed roles for an endpoint "
    "and checks whether the authenticated user's role is included in the "
    "allowed role list. Unauthorized users receive an HTTP 403 response."
)


# ============================================================
# 6. DATABASE DESIGN
# ============================================================

heading("6. Database Design")

p(
    "PostgreSQL is used as the relational database. The schema contains "
    "nine primary tables that represent bases, users, equipment, assets, "
    "purchases, transfers, assignments, expenditures and audit logs."
)

db_data = [
    ["Table", "Purpose"],
    ["bases", "Stores military base information."],
    ["users", "Stores usernames, password hashes, roles and base relationships."],
    ["equipment_types", "Stores equipment names and categories."],
    ["assets", "Stores current asset quantities by base and equipment type."],
    ["purchases", "Records purchased or incoming assets."],
    ["transfers", "Records movement of assets between bases."],
    ["assignments", "Records allocation of assets to personnel."],
    ["expenditures", "Records consumed or expended assets."],
    ["audit_logs", "Stores audit information for system actions."],
]

table = Table(db_data, colWidths=[1.7 * inch, 4.3 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#f3f4f6")]),
        ("PADDING", (0, 0), (-1, -1), 6),
    ])
)

story.append(table)

subheading("Database Integrity")

bullet("Primary keys uniquely identify records.")
bullet("Foreign keys maintain relationships between tables.")
bullet("CHECK constraints restrict invalid roles, categories and quantities.")
bullet("Unique constraint prevents duplicate base/equipment asset combinations.")
bullet("Indexes are created on frequently queried fields such as base IDs and equipment type IDs.")
bullet("Transfer records prevent transfers from a base to itself.")


# ============================================================
# 7. CORE FEATURES
# ============================================================

heading("7. Core Features")

subheading("Authentication")

p(
    "Users can register and log in through the authentication API. Passwords "
    "are securely hashed and authentication is handled using JWT tokens."
)

subheading("Asset Management")

p(
    "The asset module manages asset quantities associated with bases and "
    "equipment types. Authorized users can create and update asset records."
)

subheading("Purchases")

p(
    "The purchases module records incoming assets, including base, equipment "
    "type, quantity and the user responsible for creating the record."
)

subheading("Transfers")

p(
    "The transfer module records movement of equipment between source and "
    "destination bases. Each transfer records the equipment type, quantity, "
    "status and initiating user."
)

subheading("Assignments")

p(
    "The assignment module records equipment allocated to personnel at a base."
)

subheading("Expenditures")

p(
    "The expenditure module records assets consumed or expended, including "
    "quantity, reason, base and responsible user."
)

subheading("Dashboard")

p(
    "The dashboard provides summarized inventory and movement information "
    "for authenticated users."
)


# ============================================================
# 8. INVENTORY CALCULATION
# ============================================================

heading("8. Inventory Calculation")

p(
    "The application uses inventory movement information to provide a view "
    "of asset quantities and movements. The core business concept is based "
    "on opening balance, movements, assignments, expenditures and closing balance."
)

p(
    "<b>Closing Balance = Opening Balance + Net Movement - Assigned - Expended</b>"
)

p(
    "<b>Net Movement = Purchases + Transfers In - Transfers Out</b>"
)

p(
    "This model allows the dashboard to present meaningful inventory "
    "information without requiring separate manually maintained totals."
)


# ============================================================
# 9. API ENDPOINTS
# ============================================================

heading("9. API Endpoints")

api_data = [
    ["Module", "Endpoint", "Method"],
    ["Authentication", "/api/auth/register", "POST"],
    ["Authentication", "/api/auth/login", "POST"],
    ["Authentication", "/api/auth/me", "GET"],
    ["Authentication", "/api/auth/admin-test", "GET"],
    ["Assets", "/api/assets", "GET"],
    ["Assets", "/api/assets", "POST"],
    ["Assets", "/api/assets/:id", "PUT"],
    ["Purchases", "/api/purchases", "GET"],
    ["Purchases", "/api/purchases", "POST"],
    ["Transfers", "/api/transfers", "GET"],
    ["Transfers", "/api/transfers", "POST"],
    ["Assignments", "/api/assignments", "GET"],
    ["Assignments", "/api/assignments", "POST"],
    ["Expenditures", "/api/expenditures", "GET"],
    ["Expenditures", "/api/expenditures", "POST"],
    ["Dashboard", "/api/dashboard/summary", "GET"],
    ["Health", "/api/health", "GET"],
]

table = Table(api_data, colWidths=[1.4 * inch, 3.5 * inch, 1.1 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#f3f4f6")]),
        ("PADDING", (0, 0), (-1, -1), 5),
    ])
)

story.append(table)


# ============================================================
# 10. SECURITY
# ============================================================

heading("10. Authentication and Security")

bullet("JWT tokens are used for authentication.")
bullet("Protected endpoints require a valid Bearer token.")
bullet("Role-based authorization is applied to restricted operations.")
bullet("Passwords are stored as hashes rather than plain text.")
bullet("Helmet is enabled to provide security-related HTTP headers.")
bullet("CORS is configured on the backend.")
bullet("PostgreSQL constraints help prevent invalid database records.")
bullet("Environment variables are used for sensitive configuration such as database credentials and JWT secrets.")


# ============================================================
# 11. AUDIT LOGGING
# ============================================================

heading("11. Audit Logging")

p(
    "The audit_logs table provides a centralized record of system actions. "
    "Each record can store the responsible user, action type, descriptive "
    "details and timestamp."
)

audit_data = [
    ["Field", "Description"],
    ["id", "Unique audit record identifier."],
    ["user_id", "User responsible for the action."],
    ["action", "Action type such as PURCHASE or TRANSFER."],
    ["details", "Description of the operation."],
    ["created_at", "Timestamp of the audit record."],
]

table = Table(audit_data, colWidths=[1.5 * inch, 4.5 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 6),
    ])
)

story.append(table)


# ============================================================
# 12. FRONTEND
# ============================================================

heading("12. Frontend Screens")

bullet("Login screen for user authentication.")
bullet("Dashboard for inventory and movement summaries.")
bullet("Inventory screen for asset information.")
bullet("Purchases screen for recording and viewing purchases.")
bullet("Transfers screen for recording and viewing transfers.")
bullet("Assignments screen for personnel asset assignments.")
bullet("Expenditures screen for recording consumed assets.")
bullet("Navigation and API integration through Axios.")


# ============================================================
# 13. DEPLOYMENT
# ============================================================

heading("13. Deployment")

p(
    "The backend API is deployed on Render and the frontend application "
    "is deployed on Vercel. PostgreSQL is hosted using Neon."
)

subheading("Backend")

p(
    "The backend is deployed as a Node.js web service. The production server "
    "uses the PORT environment variable supplied by the hosting platform."
)

subheading("Frontend")

p(
    "The React/Vite frontend is deployed on Vercel as a production web application."
)

subheading("Database")

p(
    "The PostgreSQL database is hosted on Neon and accessed by the backend "
    "using the configured database connection."
)


# ============================================================
# 14. SETUP INSTRUCTIONS
# ============================================================

heading("14. Setup Instructions")

p("<b>Backend:</b>")

bullet("Navigate to the backend directory.")
bullet("Install dependencies using npm install.")
bullet("Configure database and JWT environment variables.")
bullet("Start the development server using npm run dev.")
bullet("For production, use npm start.")

p("<b>Frontend:</b>")

bullet("Navigate to the frontend directory.")
bullet("Install dependencies using npm install.")
bullet("Configure the backend API base URL.")
bullet("Start the development server using npm run dev.")


# ============================================================
# 15. TEST CREDENTIALS
# ============================================================

heading("15. Sample Test Credentials")

credentials = [
    ["Role", "Username", "Password", "Base"],
    ["Admin", "admin_user", "AdminPass123!", "All Bases"],
    ["Base Commander", "commander_alpha", "CommandPass123!", "Fort Alpha / Base #1"],
    ["Logistics Officer", "logistics_officer", "LogisticsPass123!", "Base #1 / Global Ops"],
]

table = Table(credentials, colWidths=[1.3 * inch, 1.5 * inch, 1.6 * inch, 1.6 * inch])
table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1f2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 5),
    ])
)

story.append(table)

p(
    "Note: Test credentials should be used only for evaluation/demo purposes "
    "and should not be reused for production systems."
)


# ============================================================
# 16. LIVE LINKS
# ============================================================

heading("16. Live Application Links")

p(
    "<b>Frontend:</b><br/>"
    "https://military-asset-management-sable.vercel.app/"
)

p(
    "<b>Backend API:</b><br/>"
    "https://military-asset-management-backend-44bl.onrender.com"
)

p(
    "<b>GitHub Repository:</b><br/>"
    "https://github.com/bhavya-Yerramanayuni/military-asset-management"
)


# ============================================================
# 17. CONCLUSION
# ============================================================

heading("17. Conclusion")

p(
    "The Military Asset Management System provides a structured full-stack "
    "solution for managing military assets across multiple bases. The system "
    "combines React, Node.js, Express and PostgreSQL to provide asset tracking, "
    "movement management, assignments, expenditures, authentication, "
    "role-based authorization and auditability."
)

p(
    "The application has been version-controlled using Git and GitHub and "
    "deployed using Vercel for the frontend, Render for the backend and Neon "
    "for PostgreSQL database hosting."
)

p(
    "The resulting system demonstrates the implementation of a modular "
    "full-stack application with relational data integrity, secured APIs "
    "and operational asset management functionality."
)


# ============================================================
# BUILD PDF
# ============================================================

doc.build(story)

print()
print("==============================================")
print("PDF CREATED SUCCESSFULLY")
print("==============================================")
print(f"File: {OUTPUT}")
print()