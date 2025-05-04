/**
 * Application branding configuration
 * This file contains all branding-related information that can be reused across the application
 */

export const branding = {
    // Company information
    company: {
      name: "SmartFreight",
      shortName: "Acme",
      description: "Intelligent freight escalation platform",
      logo: "/logo.svg", // Path to your logo file
      favicon: "/favicon.ico",
    },
    
    // Theme colors (if needed outside of CSS)
    colors: {
      primary: "oklch(0.723 0.219 149.579)",
      secondary: "oklch(0.967 0.001 286.375)",
    },
    
    // Contact information
    contact: {
      email: "info@acmeinc.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Anytown, USA",
    },
    
    // Social media
    social: {
      twitter: "https://twitter.com/acmeinc",
      linkedin: "https://linkedin.com/company/acmeinc",
      facebook: "https://facebook.com/acmeinc",
    },
    
    // Copyright information
    copyright: {
      year: new Date().getFullYear(),
      text: "© Acme Inc. All rights reserved.",
    }
  }
  
  export default branding;