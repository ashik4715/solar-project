import { NextRequest, NextResponse } from "next/server";

/**
 * Swagger UI documentation endpoint - serves Swagger UI via CDN
 */

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Swagger API documentation
 *     tags: [Documentation]
 */
export async function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Solar Store API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
              url: "/api/swagger.json",
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "StandaloneLayout"
            })
          }
        </script>
      </body>
    </html>
  `;
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
