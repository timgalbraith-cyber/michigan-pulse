import { useState, useEffect } from "react";

const SUPABASE_URL = "https://znljkqtbqlxecmzebsmi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubGprcXRicWx4ZWNtemVic21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjAxMjksImV4cCI6MjA5NDA5NjEyOX0.fpjnsZCwfxHHxEo2WV8BlXTxhTT2XPzUmPNjWZu01eg";

const sbHeaders = (token) => ({
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${token || SUPABASE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

const sb = {
  from: (table, token) => ({
    select: async (cols = "*", opts = {}) => {
      let url = `${SUPABASE_URL}/rest/v1/${table}?select=${cols}`;
      if (opts.filter) url += `&${opts.filter}`;
      if (opts.order) url += `&order=${opts.order}`;
      const r = await fetch(url, { headers: sbHeaders(token) });
      return r.json();
    },
    upsert: async (data) => {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: { ...sbHeaders(token), "Prefer": "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(data) });
      return r.json();
    },
    insert: async (data) => {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: sbHeaders(token), body: JSON.stringify(data) });
      return r.json();
    },
    update: async (data, filter) => {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, { method: "PATCH", headers: sbHeaders(token), body: JSON.stringify(data) });
      return r.json();
    },
    delete: async (filter) => {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, { method: "DELETE", headers: sbHeaders(token) });
      return r.ok;
    },
  }),
  auth: {
    signUp: async (email, password, name) => {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method: "POST", headers: sbHeaders(), body: JSON.stringify({ email, password, options: { data: { name } } }) });
      return r.json();
    },
    signIn: async (email, password) => {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: sbHeaders(), body: JSON.stringify({ email, password }) });
      return r.json();
    },
    signOut: async (token) => {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: sbHeaders(token) });
    },
    getUser: async (token) => {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: sbHeaders(token) });
      return r.json();
    },
  },
};

// ─── OFFICIALS ────────────────────────────────────────────────────────────────
const OFFICIALS = [
  // Federal Executive
  { id: "trump", name: "Donald Trump", title: "President of the United States", party: "R", chamber: "Federal Executive", city: "", county: "statewide", image: "DT" },
  // Michigan Executive
  { id: "whitmer", name: "Gretchen Whitmer", title: "Governor", party: "D", chamber: "Executive", city: "", county: "statewide", image: "GW" },
  { id: "gilchrist", name: "Garlin Gilchrist II", title: "Lt. Governor", party: "D", chamber: "Executive", city: "", county: "statewide", image: "GG" },
  { id: "nessel", name: "Dana Nessel", title: "Attorney General", party: "D", chamber: "Executive", city: "", county: "statewide", image: "DN" },
  { id: "benson", name: "Jocelyn Benson", title: "Secretary of State", party: "D", chamber: "Executive", city: "", county: "statewide", image: "JB" },
  // Federal
  { id: "peters", name: "Gary Peters", title: "U.S. Senator", party: "D", chamber: "Federal", city: "", county: "statewide", image: "GP" },
  { id: "slotkin", name: "Elissa Slotkin", title: "U.S. Senator", party: "D", chamber: "Federal", city: "", county: "statewide", image: "ES" },
  { id: "mcclain", name: "Lisa McClain", title: "U.S. Rep. (MI-09)", party: "R", chamber: "Federal", city: "", county: "lapeer", image: "LMC" },
  { id: "huizenga", name: "Bill Huizenga", title: "U.S. Rep. (MI-04)", party: "R", chamber: "Federal", city: "", county: "statewide", image: "BH" },
  { id: "moolenaar", name: "John Moolenaar", title: "U.S. Rep. (MI-02)", party: "R", chamber: "Federal", city: "", county: "statewide", image: "JM" },
  { id: "mcdonaldrivet", name: "Kristen McDonald Rivet", title: "U.S. Rep. (MI-08)", party: "D", chamber: "Federal", city: "", county: "genesee", image: "KMR" },
  // State Legislature
  { id: "mcbroom", name: "Ed McBroom", title: "State Senator", party: "R", chamber: "State Senate", city: "", county: "lapeer", image: "EM" },
  { id: "hertel", name: "Curtis Hertel Jr.", title: "State Senator", party: "D", chamber: "State Senate", city: "", county: "statewide", image: "CH" },
  { id: "breen", name: "Matt Breen", title: "State Rep.", party: "R", chamber: "State House", city: "", county: "lapeer", image: "MB" },
  { id: "scott", name: "Helena Scott", title: "State Rep.", party: "D", chamber: "State House", city: "", county: "statewide", image: "HS" },
  // Lapeer County
  { id: "spencer", name: "Theresa Spencer", title: "County Clerk", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "TS" },
  { id: "jmiller", name: "John D. Miller", title: "Prosecuting Attorney", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "JD" },
  { id: "stearns", name: "Amy Stearns", title: "Register of Deeds", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "AS" },
  { id: "mckenna", name: "Scott McKenna", title: "Sheriff", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "SM" },
  { id: "horton", name: "Henry Horton", title: "County Surveyor", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "HH" },
  { id: "wagner", name: "Andy Wagner", title: "Drain Commissioner", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "AW" },
  { id: "dmiller", name: "Dana Miller", title: "County Treasurer", party: "R", chamber: "Lapeer County", city: "", county: "lapeer", image: "DM" },
  { id: "howell", name: "Gary Howell", title: "Commissioner, Dist. 2 (Chair)", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "GH" },
  { id: "mcmahan", name: "Scott McMahan", title: "Commissioner, Dist. 1", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "SCM" },
  { id: "knisely", name: "Kevin Knisely", title: "Commissioner, Dist. 3", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "KK" },
  { id: "haggadone", name: "Brad Haggadone", title: "Commissioner, Dist. 4", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "BHD" },
  { id: "kempf", name: "Ian Kempf", title: "Commissioner, Dist. 5", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "IK" },
  { id: "wise", name: "Greg Wise", title: "Commissioner, Dist. 6", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "GW2" },
  { id: "zender", name: "Bryan Zender", title: "Commissioner, Dist. 7", party: "R", chamber: "Lapeer Co. Board", city: "", county: "lapeer", image: "BZ" },
  // Local Judiciary
  { id: "nolan", name: "Judge Michael Nolan", title: "40th Circuit Court", party: "N", chamber: "Local Judiciary", city: "", county: "lapeer", image: "MN" },
  { id: "hodges", name: "Judge Michael Hodges", title: "40th Circuit Court", party: "N", chamber: "Local Judiciary", city: "", county: "lapeer", image: "MH" },
  { id: "barnard", name: "Judge Laura Barnard", title: "71A District Court", party: "N", chamber: "Local Judiciary", city: "", county: "lapeer", image: "LB" },
  { id: "dmccarthy", name: "Judge Denis McCarthy", title: "Probate Court", party: "N", chamber: "Local Judiciary", city: "", county: "lapeer", image: "DMC" },
  // City of Lapeer
  { id: "hing", name: "Jeramy Hing", title: "Mayor, City of Lapeer", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "JH" },
  { id: "atwood", name: "Commissioner Atwood", title: "City Commissioner", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "ATW" },
  { id: "brady", name: "Commissioner Brady", title: "City Commissioner", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "BRD" },
  { id: "glisman", name: "Commissioner Glisman", title: "City Commissioner", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "GLS" },
  { id: "petrie", name: "Commissioner Petrie", title: "City Commissioner", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "PTR" },
  { id: "mccarthy", name: "Lynne McCarthy", title: "City Commissioner", party: "N", chamber: "City of Lapeer", city: "lapeer", county: "lapeer", image: "LM" },
  // City of Flint
  { id: "neeley", name: "Sheldon Neeley", title: "Mayor", party: "D", chamber: "City of Flint", city: "flint", county: "genesee", image: "SN" },
  { id: "lewis", name: "Ladel Lewis", title: "City Council, Ward 2", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "LL" },
  { id: "qmurphy", name: "Quincy Murphy", title: "City Council, Ward 3", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "QM" },
  { id: "priestley", name: "Judy Priestley", title: "City Council, Ward 4", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "JP" },
  { id: "winfrey", name: "Jerri Winfrey-Carter", title: "City Council, Ward 5", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "JWC" },
  { id: "burns", name: "Tonya Burns", title: "City Council, Ward 6", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "TB" },
  { id: "mushatt", name: "Candice Mushatt", title: "City Council, Ward 7, President", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "CM" },
  { id: "pfeiffer", name: "Dennis Pfeiffer", title: "City Council, Ward 8", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "DP" },
  { id: "worthing", name: "Eva Worthing", title: "City Council, Ward 9", party: "N", chamber: "City of Flint", city: "flint", county: "genesee", image: "EW" },
  // City of Imlay City
  { id: "yockey", name: "Barbara Yockey", title: "Mayor", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "BY" },
  { id: "tanis", name: "Bob Tanis", title: "Commissioner, Mayor Pro-Tem", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "BT" },
  { id: "deluca", name: "Joe DeLuca", title: "Commissioner", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "JDL" },
  { id: "sdavis", name: "Stu Davis", title: "Commissioner", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "SD" },
  { id: "ramirez", name: "Al Ramirez", title: "Commissioner", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "AR" },
  { id: "blount", name: "Tom Blount", title: "Commissioner", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "TBL" },
  { id: "stempien", name: "Luke Stempien", title: "Commissioner", party: "N", chamber: "City of Imlay City", city: "imlaycity", county: "lapeer", image: "LS" },
  // City of Davison
  { id: "kalisz", name: "Stacey Kalisz", title: "Mayor", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "SK" },
  { id: "perry", name: "David Perry", title: "Council Member, Mayor Pro-Tem", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "DP2" },
  { id: "hynes", name: "Brenden Hynes", title: "Council Member", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "BH2" },
  { id: "ballard", name: "Robin Ballard", title: "Council Member", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "RB" },
  { id: "bunton", name: "Angela Bunton", title: "Council Member", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "AB" },
  { id: "daly", name: "Eric Daly", title: "Council Member", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "ED" },
  { id: "lindstrom", name: "Ben Lindstrom", title: "Council Member", party: "N", chamber: "City of Davison", city: "davison", county: "genesee", image: "BL" },
  // City of Port Huron
  { id: "ashford", name: "Anita Ashford", title: "Mayor", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "AA" },
  { id: "archibald", name: "Sherry Archibald", title: "Council Member, Mayor Pro-Tem", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "SA" },
  { id: "haremza", name: "Conrad Haremza", title: "Council Member", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "CHR" },
  { id: "tlamb", name: "Teri Lamb", title: "Council Member", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "TL" },
  { id: "mosurak", name: "Bob Mosurak", title: "Council Member", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "BM" },
  { id: "bpayton", name: "Barbara Payton", title: "Council Member", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "BP" },
  { id: "pemberton", name: "Jeff Pemberton", title: "Council Member", party: "N", chamber: "City of Port Huron", city: "porthuron", county: "stclair", image: "JFP" },
  // City of Detroit
  { id: "sheffield", name: "Mary Sheffield", title: "Mayor", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "MS" },
  { id: "tate", name: "James Tate", title: "Council Member, District 1, President", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "JT" },
  { id: "whitfield", name: "Angela Whitfield-Calloway", title: "Council Member, District 2", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "AWC" },
  { id: "benson2", name: "Scott Benson", title: "Council Member, District 3", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "SB" },
  { id: "ljohnson", name: "Latisha Johnson", title: "Council Member, District 4", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "LJ" },
  { id: "rmiller", name: "Renata Miller", title: "Council Member, District 5", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "RM" },
  { id: "santiago", name: "Gabriela Santiago-Romero", title: "Council Member, District 6", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "GSR" },
  { id: "mccampbell", name: "Denzel Anton McCampbell", title: "Council Member, District 7", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "DAM" },
  { id: "mwaters", name: "Mary Waters", title: "Council Member, At-Large", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "MW" },
  { id: "cyoung", name: "Coleman Young II", title: "Council Member, At-Large, President Pro-Tem", party: "N", chamber: "City of Detroit", city: "detroit", county: "wayne", image: "CY2" },
  // City of Lansing
  { id: "schor", name: "Andy Schor", title: "Mayor", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "ASC" },
  { id: "spadafore", name: "Peter Spadafore", title: "Council Member, Ward 4, President", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "PS" },
  { id: "pehlivanoglu", name: "Trini Lopez-Pehlivanoglu", title: "Council Member, At-Large, Vice President", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "TLP" },
  { id: "kost", name: "Ryan Kost", title: "Council Member, Ward 1", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "RK" },
  { id: "hussain", name: "Adam Hussain", title: "Council Member, Ward 3", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "AH" },
  { id: "carter", name: "Tamera Carter", title: "Council Member, At-Large", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "TC" },
  { id: "garza", name: "Jeremy Garza", title: "Council Member, At-Large", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "JG" },
  { id: "cmartinez", name: "Clara Martinez", title: "Council Member, At-Large", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "CLM" },
  { id: "dnevarez", name: "Deyanira Nevarez Martinez", title: "Council Member, Ward 2", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "DNM" },
  { id: "bjackson", name: "Brian Jackson", title: "Council Member", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "BJK" },
  { id: "jbrown", name: "Jeffrey Brown", title: "Council Member", party: "N", chamber: "City of Lansing", city: "lansing", county: "ingham", image: "JBR" },
  // City of Grand Rapids
  { id: "lagrand", name: "David LaGrand", title: "Mayor", party: "D", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "DLG" },
  { id: "belchak", name: "AliciaMarie Belchak", title: "Commissioner, 1st Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "AMB" },
  { id: "robbins", name: "Drew Robbins", title: "Commissioner, 1st Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "DR" },
  { id: "ysasi", name: "Milinda Ysasi", title: "Commissioner, 2nd Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "MY" },
  { id: "knight", name: "Lisa Knight", title: "Commissioner, 2nd Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "LK" },
  { id: "kilgore", name: "Marshall Kilgore", title: "Commissioner, 3rd Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "MK" },
  { id: "perdue", name: "Kelsey Perdue", title: "Commissioner, 3rd Ward", party: "N", chamber: "City of Grand Rapids", city: "grandrapids", county: "kent", image: "KP" },
  // City of Ann Arbor
  { id: "ctaylor", name: "Christopher Taylor", title: "Mayor", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "CT" },
  { id: "briggs", name: "Erica Briggs", title: "Council Member, Ward 1", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "EB" },
  { id: "disch", name: "Lisa Disch", title: "Council Member, Ward 1", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "LD" },
  { id: "watson", name: "Chris Watson", title: "Council Member, Ward 2", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "CW" },
  { id: "mallek", name: "Jon Mallek", title: "Council Member, Ward 2", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "JML" },
  { id: "ghazi", name: "Ayesha Ghazi Edwin", title: "Council Member, Ward 3", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "AGE" },
  { id: "radina", name: "Travis Radina", title: "Council Member, Ward 3", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "TR" },
  { id: "akmon", name: "Dharma Akmon", title: "Council Member, Ward 4", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "DA" },
  { id: "eyer", name: "Jen Eyer", title: "Council Member, Ward 4", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "JE" },
  { id: "cornell", name: "Jennifer Cornell", title: "Council Member, Ward 5", party: "D", chamber: "City of Ann Arbor", city: "annarbor", county: "washtenaw", image: "JCO" },
];

const CATEGORIES = [
  { id: "effectiveness", label: "Effectiveness", icon: "⚡" },
  { id: "responsiveness", label: "Responsiveness", icon: "📬" },
  { id: "transparency", label: "Transparency", icon: "🔍" },
  { id: "leadership", label: "Leadership", icon: "🧭" },
];

const CHAMBERS = ["All","Federal Executive","Executive","Federal","State Senate","State House","Lapeer County","Lapeer Co. Board","Local Judiciary","City of Lapeer","City of Flint","City of Imlay City","City of Davison","City of Port Huron","City of Detroit","City of Lansing","City of Grand Rapids","City of Ann Arbor"];

const CITIES = [
  { value: "", label: "All Cities" },
  { value: "lapeer", label: "Lapeer" },
  { value: "imlaycity", label: "Imlay City" },
  { value: "davison", label: "Davison" },
  { value: "flint", label: "Flint" },
  { value: "porthuron", label: "Port Huron" },
  { value: "detroit", label: "Detroit" },
  { value: "lansing", label: "Lansing" },
  { value: "grandrapids", label: "Grand Rapids" },
  { value: "annarbor", label: "Ann Arbor" },
];

const COUNTIES = [
  { value: "", label: "All Counties" },
  { value: "lapeer", label: "Lapeer County" },
  { value: "genesee", label: "Genesee County" },
  { value: "wayne", label: "Wayne County" },
  { value: "kent", label: "Kent County" },
  { value: "ingham", label: "Ingham County" },
  { value: "washtenaw", label: "Washtenaw County" },
  { value: "stclair", label: "St. Clair County" },
  { value: "statewide", label: "Statewide" },
];

// ─── GEO POLLS ───────────────────────────────────────────────────────────────
const GEO_POLLS = [
  { key: "poll_lapeer_1", question: "Would you vote for Mayor Hing if an election was held today?", region: "lapeer" },
  { key: "poll_flint_1", question: "Is Mayor Neeley doing enough to address Flint's infrastructure needs?", region: "flint" },
  { key: "poll_detroit_1", question: "Do you approve of how Detroit city leadership is handling public safety?", region: "detroit" },
  { key: "poll_lansing_1", question: "Is Mayor Schor doing a good job leading Lansing?", region: "lansing" },
  { key: "poll_grandrapids_1", question: "Do you approve of Mayor LaGrand's performance so far?", region: "grandrapids" },
  { key: "poll_annarbor_1", question: "Should Ann Arbor prioritize housing affordability over environmental goals?", region: "annarbor" },
  { key: "poll_statewide_1", question: "Do you approve of Governor Whitmer's job performance?", region: "statewide" },
];

const REGION_MAP = {
  lapeer: ["lapeer city", "lapeer", "imlay city", "imlaycity"],
  flint: ["flint"],
  detroit: ["detroit"],
  lansing: ["lansing", "east lansing"],
  grandrapids: ["grand rapids"],
  annarbor: ["ann arbor"],
};

// ─── LIVE STREAM CONFIG ───────────────────────────────────────────────────────
const IS_LIVE = false;
const LIVE_PLATFORM = "facebook";
const LIVE_URL = "https://www.facebook.com/HashtagLapeer";
const LIVE_TITLE = "Hashtag w/ Timothy David Galbraith is LIVE now!";
// ─────────────────────────────────────────────────────────────────────────────

const BLUE = "#00aaff";
const GREEN = "#3ddc84";
const partyColor = (p) => p === "D" ? BLUE : p === "R" ? "#ff4d4d" : "#888";
const partyLabel = (p) => p === "D" ? "Democrat" : p === "R" ? "Republican" : "Nonpartisan";
const scoreColor = (s) => s >= 60 ? GREEN : s >= 40 ? "#f59e0b" : "#ff4d4d";
const sentColor = (s) => s === "positive" ? GREEN : s === "negative" ? "#ff4d4d" : s === "mixed" ? "#f59e0b" : "#888";
const Logo = ({ size = 44 }) => ( <img src="https://i.imgur.com/IoX6zKy.png" alt="Michigan Pulse" width={size} height={size} style={{ objectFit: "contain", display: "block" }} /> );

export default function MichiganPulse() {
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [comments, setComments] = useState({});
  const [selId, setSelId] = useState(null);
  const [selCat, setSelCat] = useState("effectiveness");
  const [chamberFilter, setChamberFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("");
  const [countyFilter, setCountyFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [comment, setComment] = useState("");
  const [aiData, setAiData] = useState({});
  const [analyzing, setAnalyzing] = useState(null);
  const [view, setView] = useState("grid");
  const [loaded, setLoaded] = useState(false);
  const [activePoll, setActivePoll] = useState(GEO_POLLS[GEO_POLLS.length - 1]); // default statewide
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [cartoonUrl, setCartoonUrl] = useState(null);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [usernameModal, setUsernameModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  const CARTOONS = [
    "https://res.cloudinary.com/dgczdb1um/video/upload/v1778623522/2026-05-12_16_49_45_swnqta.mp4",
    "https://res.cloudinary.com/dgczdb1um/video/upload/v1778623529/2026-05-12_16_39_22_ibdjyn.mp4",
  ];

  const showRandomCartoon = () => {
    const url = CARTOONS[Math.floor(Math.random() * CARTOONS.length)];
    setCartoonUrl(url);
  };

  useEffect(() => {
    (async () => {
      try {
        // Check for OAuth callback token in URL hash
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.replace('#', ''));
          const token = params.get('access_token');
          if (token) {
            const uData = await sb.auth.getUser(token);
            if (uData && uData.id) {
              const name = uData.user_metadata?.name || uData.email?.split('@')[0] || 'User';
              const newUser = { id: uData.id, name, email: uData.email, avatar: name.slice(0,2).toUpperCase(), token };
              setUser(newUser);
              try { localStorage.setItem('mi_sb_user', JSON.stringify(newUser)); } catch(e) {}
              if (uData.id) await sb.from('users', token).upsert({ id: uData.id, name, email: uData.email, provider: 'google' }).catch(()=>{});
              loadUserVotes(uData.id, token);
              // Clean up URL
              window.history.replaceState(null, '', window.location.pathname);
              setTimeout(() => showRandomCartoon(), 500);
              await loadAllVotes();
            }
          }
        } else {
          // Load persisted session
          const savedUser = await Promise.resolve(localStorage.getItem('mi_sb_user') ? {value: localStorage.getItem('mi_sb_user')} : null);
          if (savedUser) {
            const u = JSON.parse(savedUser.value);
            setUser(u);
            loadUserVotes(u.id, u.token);
          }
        }
        await loadAllVotes();
        await loadAllComments();
        await loadAIData();
        detectRegion();
      } catch(e) { console.error('Load error', e); }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (user && (!user.username || user.username === user.name || user.username === user.email?.split('@')[0])) {
      const timer = setTimeout(() => setUsernameModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const detectRegion = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      const city = (data.city || "").toLowerCase();
      for (const [region, cities] of Object.entries(REGION_MAP)) {
        if (cities.some(c => city.includes(c))) {
          const poll = GEO_POLLS.find(p => p.region === region);
          if (poll) { setActivePoll(poll); return; }
        }
      }
    } catch(e) {}
  };

  const loadAllVotes = async () => {
    try {
      const data = await sb.from('votes').select('official_id,category,score');
      if (!Array.isArray(data)) return;
      const agg = {};
      data.forEach(v => {
        const key = `${v.official_id}_${v.category}`;
        if (!agg[key]) agg[key] = { total: 0, count: 0 };
        agg[key].total += v.score;
        agg[key].count += 1;
      });
      setVotes(agg);
    } catch(e) {}
  };

  const loadUserVotes = async (userId) => {
    try {
      const data = await sb.from('votes').select('official_id,category,score', { filter: `user_id=eq.${userId}` });
      if (!Array.isArray(data)) return;
      const uv = {};
      data.forEach(v => { uv[`${v.official_id}_${v.category}`] = v.score; });
      setUserVotes(uv);
    } catch(e) {}
  };

  const loadAllComments = async () => {
    try {
      const data = await sb.from('comments').select('official_id,text,created_at,id,username');
      if (!Array.isArray(data)) return;
      const byOfficial = {};
      data.forEach(c => {
        if (!byOfficial[c.official_id]) byOfficial[c.official_id] = [];
        byOfficial[c.official_id].unshift({ text: c.text, ts: new Date(c.created_at).getTime(), id: c.id, username: c.username });
      });
      setComments(byOfficial);
    } catch(e) {}
  };

  const loadAIData = async () => {
    try {
      const data = await sb.from('ai_analyses').select('official_id,sentiment,score,themes,summary');
      if (!Array.isArray(data)) return;
      const ai = {};
      data.forEach(a => { ai[a.official_id] = { sentiment: a.sentiment, score: a.score, themes: a.themes, summary: a.summary }; });
      setAiData(ai);
    } catch(e) {}
  };

  const handleEmailAuth = async (mode) => {
    setAuthError(''); setAuthLoading(true);
    if (!authEmail.includes('@')) { setAuthError('Enter a valid email.'); setAuthLoading(false); return; }
    if (authPass.length < 6) { setAuthError('Password must be at least 6 characters.'); setAuthLoading(false); return; }
    if (mode === 'signup' && !authName.trim()) { setAuthError('Please enter your name.'); setAuthLoading(false); return; }
    if (mode === 'signup' && !authUsername.trim()) { setAuthError('Please choose a username.'); setAuthLoading(false); return; }
    if (mode === 'signup' && authUsername.trim().length < 3) { setAuthError('Username must be at least 3 characters.'); setAuthLoading(false); return; }
    if (mode === 'signup') {
      // Check username uniqueness
      const clean = authUsername.trim().replace(/[^a-zA-Z0-9_]/g,'');
      const existing = await sb.from('users', null).select('id', { filter: `username=eq.${clean}` });
      if (Array.isArray(existing) && existing.length > 0) { setAuthError('That username is taken. Please choose another.'); setAuthLoading(false); return; }
    }
    try {
      let res;
      if (mode === 'signup') {
        res = await sb.auth.signUp(authEmail, authPass, authName.trim());
        if (res.error) { setAuthError(res.error.message || 'Sign up failed.'); setAuthLoading(false); return; }
      } else {
        res = await sb.auth.signIn(authEmail, authPass);
        if (res.error) { setAuthError(res.error.message || 'Invalid email or password.'); setAuthLoading(false); return; }
      }
      const token = res.access_token;
      const uData = res.user || {};
      const name = uData.user_metadata?.name || authEmail.split('@')[0];
      let username = mode === 'signup' ? authUsername.trim().replace(/[^a-zA-Z0-9_]/g,'') : null;
      // For login, fetch existing username from users table
      if (mode === 'login' && uData.id) {
        try {
          const existing = await sb.from('users', token).select('username', { filter: `id=eq.${uData.id}` });
          if (Array.isArray(existing) && existing[0]) username = existing[0].username;
        } catch(e) {}
      }
      const newUser = { id: uData.id, name, email: uData.email || authEmail, avatar: name.slice(0,2).toUpperCase(), token, username: username || name };
      setUser(newUser);
      try { localStorage.setItem('mi_sb_user', JSON.stringify(newUser)); } catch(e) {}
      if (uData.id) await sb.from('users', token).upsert({ id: uData.id, name, email: uData.email, provider: 'email', username: username || name }).catch(()=>{});
      loadUserVotes(uData.id, token);
      await loadAllVotes();
      setAuthModal(false);
      if (!username || username === name) {
        setTimeout(() => setUsernameModal(true), 300);
      } else {
        setTimeout(() => showRandomCartoon(), 300);
      }
    } catch(e) { setAuthError('Connection error. Please try again.'); }
    setAuthLoading(false);
    setAuthEmail(''); setAuthPass(''); setAuthName(''); setAuthUsername(''); setAuthError('');
  };

  const handleSocialAuth = async (provider) => {
    if (provider === 'google') {
      const redirectTo = encodeURIComponent('https://michiganpulse.net');
      window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
    } else {
      setAuthError('Apple sign-in coming soon. Use email or Google for now.');
    }
  };

  const handleSignOut = async () => {
    if (user?.token) await sb.auth.signOut(user.token).catch(()=>{});
    setUser(null); setUserVotes({});
    try { localStorage.removeItem('mi_sb_user'); } catch(e) {}
  };

  const requireAuth = () => {
    if (!user) { setAuthModal(true); setAuthTab('login'); return false; }
    return true;
  };

  const saveUsername = async () => {
    setUsernameError(''); setUsernameLoading(true);
    const clean = newUsername.trim().replace(/[^a-zA-Z0-9_]/g,'');
    if (clean.length < 3) { setUsernameError('Must be at least 3 characters.'); setUsernameLoading(false); return; }
    // Check uniqueness
    try {
      const existing = await sb.from('users', null).select('id', { filter: `username=eq.${clean}` });
      if (Array.isArray(existing) && existing.length > 0) { setUsernameError('That username is taken. Try another.'); setUsernameLoading(false); return; }
      // Save to Supabase
      await sb.from('users', user.token).upsert({ id: user.id, username: clean });
      // Update local user
      const updatedUser = { ...user, username: clean };
      setUser(updatedUser);
      try { localStorage.setItem('mi_sb_user', JSON.stringify(updatedUser)); } catch(e) {}
      setUsernameModal(false);
      setNewUsername('');
      setTimeout(() => showRandomCartoon(), 300);
    } catch(e) { setUsernameError('Error saving username. Try again.'); }
    setUsernameLoading(false);
  };

  const castVote = async (id, cat, score) => {
    if (!requireAuth()) return;
    const key = `${id}_${cat}`;
    const prevMy = userVotes[key];
    const prevAgg = votes[key] || { total: 0, count: 0 };
    let newTotal = prevAgg.total + score;
    let newCount = prevAgg.count + 1;
    if (prevMy) { newTotal = prevAgg.total - prevMy + score; newCount = prevAgg.count; }
    setVotes({ ...votes, [key]: { total: newTotal, count: newCount } });
    setUserVotes({ ...userVotes, [key]: score });
    try {
      const result = await sb.from('votes', user.token).upsert({ user_id: user.id, official_id: id, category: cat, score });
      console.log('Vote save result:', JSON.stringify(result));
    } catch(e) { console.error('Vote save error:', e); }
  };

  const submitComment = async (id) => {
    if (!requireAuth()) return;
    if (!comment.trim()) return;
    const text = comment.trim();
    const entry = { text, ts: Date.now(), id: Math.random().toString(36).slice(2) };
    const prev = comments[id] || [];
    setComments({ ...comments, [id]: [entry, ...prev].slice(0, 20) });
    setComment("");
    try { await sb.from('comments', user.token).insert({ user_id: user.id, official_id: id, text }); } catch(e) {}
    runAI(id, [entry, ...prev].slice(0, 20));
  };

  const runAI = async (id, list) => {
    if (!list.length) return;
    setAnalyzing(id);
    const off = OFFICIALS.find(o => o.id === id);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: 'Analyze public feedback about an elected official. Return ONLY valid JSON: {"sentiment":"positive"|"negative"|"mixed"|"neutral","score":<0-100>,"themes":[<up to 3 strings>],"summary":"<2 sentences>"}',
          messages: [{ role: "user", content: `Comments about ${off.name} (${off.title}):\n${list.map(c=>`- "${c.text}"`).join("\n")}` }]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b => b.type === "text")?.text || "{}";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      const nai = { ...aiData, [id]: parsed };
      setAiData(nai);
      try {
        await sb.from('ai_analyses', null).upsert({ official_id: id, sentiment: parsed.sentiment, score: parsed.score, themes: parsed.themes, summary: parsed.summary, updated_at: new Date().toISOString() });
      } catch(e) {}
    } catch(e) {}
    setAnalyzing(null);
  };

  const getScore = (id, cat) => {
    const d = votes[`${id}_${cat}`];
    if (!d || !d.count) return null;
    return Math.round((d.total / d.count) * 10);
  };

  const getOverall = (id) => {
    const scores = CATEGORIES.map(c => getScore(id, c.id)).filter(s => s !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  };

  const filtered = OFFICIALS.filter(o => {
    if (chamberFilter !== "All" && o.chamber !== chamberFilter) return false;
    if (cityFilter && o.city !== cityFilter) return false;
    if (countyFilter && o.county !== countyFilter) return false;
    if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase()) && !o.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const official = selId ? OFFICIALS.find(o => o.id === selId) : null;

  const PollWidget = ({ poll }) => {
    const pollVotes = votes[poll.key] || { yes: 0, no: 0 };
    const myPollVote = userVotes[poll.key];
    const total = (pollVotes.yes || 0) + (pollVotes.no || 0);
    const yesPct = total ? Math.round(((pollVotes.yes||0)/total)*100) : 50;
    const noPct = total ? Math.round(((pollVotes.no||0)/total)*100) : 50;
    const castPollVote = async (val) => {
      if (!requireAuth()) return;
      const prev = votes[poll.key] || { yes:0, no:0 };
      const prevMy = userVotes[poll.key];
      let updated = { ...prev };
      if (prevMy) { updated[prevMy] = Math.max(0, (updated[prevMy]||0)-1); }
      updated[val] = (updated[val]||0)+1;
      setVotes({ ...votes, [poll.key]: updated });
      setUserVotes({ ...userVotes, [poll.key]: val });
      try { await sb.from('poll_votes', user.token).upsert({ user_id: user.id, poll_key: poll.key, vote: val }); } catch(e) {}
    };
    return (
      <div style={{marginBottom:22,padding:"18px 22px",background:"linear-gradient(135deg,#00aaff0d,#3ddc840a)",border:`1px solid ${BLUE}33`,borderRadius:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${BLUE},${GREEN})`}}/>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 260px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:GREEN,boxShadow:`0 0 6px ${GREEN}`}}/>
              <span style={{fontSize:9,color:GREEN,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Featured Poll</span>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:"#e4f0ff",lineHeight:1.4,marginBottom:14}}>{poll.question}</div>
            <div style={{display:"flex",gap:9}}>
              <button className="btn" onClick={()=>castPollVote('yes')} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid ${GREEN}${myPollVote==='yes'?'99':'33'}`,background:myPollVote==='yes'?`${GREEN}22`:"#ffffff07",color:myPollVote==='yes'?GREEN:"#ffffff77",fontSize:13,fontWeight:700,cursor:"pointer"}}>👍 Yes{myPollVote==='yes'?' ✓':''}</button>
              <button className="btn" onClick={()=>castPollVote('no')} style={{flex:1,padding:"9px 0",borderRadius:8,border:`1px solid #ff4d4d${myPollVote==='no'?'99':'33'}`,background:myPollVote==='no'?"#ff4d4d22":"#ffffff07",color:myPollVote==='no'?"#ff4d4d":"#ffffff77",fontSize:13,fontWeight:700,cursor:"pointer"}}>👎 No{myPollVote==='no'?' ✓':''}</button>
            </div>
          </div>
          <div style={{flex:"0 0 160px",minWidth:140}}>
            <div style={{fontSize:9,color:"#ffffff33",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>Live Results · {total} votes</div>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:GREEN,fontWeight:600}}>Yes</span><span style={{fontSize:11,color:GREEN,fontWeight:700}}>{yesPct}%</span></div>
              <div style={{height:6,background:"#ffffff08",borderRadius:3,overflow:"hidden"}}><div className="bar" style={{height:"100%",width:`${yesPct}%`,background:GREEN,borderRadius:3}}/></div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:"#ff4d4d",fontWeight:600}}>No</span><span style={{fontSize:11,color:"#ff4d4d",fontWeight:700}}>{noPct}%</span></div>
              <div style={{height:6,background:"#ffffff08",borderRadius:3,overflow:"hidden"}}><div className="bar" style={{height:"100%",width:`${noPct}%`,background:"#ff4d4d",borderRadius:3}}/></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!loaded) return (
    <div style={{background:"#030508",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <Logo size={72}/>
      <div style={{color:BLUE,fontSize:16,letterSpacing:3,fontFamily:"sans-serif"}}>LOADING...</div>
    </div>
  );

  const C = { bg:"#030508",card:"#ffffff06",border:"#ffffff0f",text:"#e0eeff",sub:"#ffffff44",faint:"#ffffff18" };

  const selectStyle = { background:"#ffffff0a",border:`1px solid ${BLUE}22`,borderRadius:8,padding:"7px 12px",color:"#e0eeff",fontSize:12,fontWeight:500,outline:"none",cursor:"pointer",fontFamily:"inherit" };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",color:C.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#00aaff33;border-radius:2px}
        .card{transition:transform .18s,box-shadow .18s;cursor:pointer}
        .card:hover{transform:translateY(-3px);box-shadow:0 8px 28px #00aaff14}
        .btn{transition:all .14s;cursor:pointer;border:none}
        .btn:hover{filter:brightness(1.18);transform:scale(1.06)}
        .btn:active{transform:scale(.95)}
        .pill{transition:all .16s;cursor:pointer;border:none}
        select option{background:#0a0f1a;color:#e0eeff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes liveping{0%{box-shadow:0 0 0 0 #ff000088}70%{box-shadow:0 0 0 10px #ff000000}100%{box-shadow:0 0 0 0 #ff000000}}
        .live-ping{animation:liveping 1.2s infinite}
        @keyframes glow{0%,100%{opacity:1}50%{opacity:.3}}
        .fu{animation:fadeUp .32s ease forwards}
        .glowing{animation:glow 1.2s infinite}
        .bar{transition:width .9s cubic-bezier(.4,0,.2,1)}
        input::placeholder{color:#ffffff33}
        textarea::placeholder{color:#ffffff33}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-150,left:-150,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,#00aaff07 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:-150,right:-150,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,#3ddc8407 0%,transparent 70%)"}}/>
      </div>

      <header style={{borderBottom:`1px solid ${BLUE}1a`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(3,5,8,.94)",backdropFilter:"blur(18px)",zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Logo size={46}/>
          <div>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.4px",background:`linear-gradient(90deg,${BLUE},${GREEN})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Michigan Pulse</div>
            <div style={{fontSize:10,color:C.sub,letterSpacing:2,textTransform:"uppercase",marginTop:1}}>Citizen Accountability Dashboard</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:GREEN,boxShadow:`0 0 8px ${GREEN}`}}/>
            <span style={{fontSize:10,color:GREEN,fontWeight:700,letterSpacing:2}}>LIVE</span>
          </div>
          {view==="detail" && <button className="pill" onClick={()=>{setView("grid");setSelId(null);}} style={{color:BLUE,fontSize:11,padding:"5px 12px",border:`1px solid ${BLUE}44`,borderRadius:6,background:`${BLUE}0e`,fontWeight:600}}>← Back</button>}
          {user ? (
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,#0077bb,#28a05e)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{user.avatar}</div>
              <span style={{fontSize:11,color:"#ffffff88",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</span>
              <button className="pill" onClick={handleSignOut} style={{fontSize:10,color:"#ffffff44",padding:"4px 10px",border:"1px solid #ffffff14",borderRadius:5,background:"transparent",cursor:"pointer"}}>Sign out</button>
            </div>
          ) : (
            <button className="pill" onClick={()=>{setAuthModal(true);setAuthTab('login');}} style={{background:`linear-gradient(90deg,#0077bb,#28a05e)`,color:"#fff",fontSize:11,fontWeight:700,padding:"7px 16px",border:"none",borderRadius:7,cursor:"pointer",letterSpacing:.5}}>Sign In</button>
          )}
        </div>
      </header>

      <main style={{maxWidth:1120,margin:"0 auto",padding:"24px 18px"}}>
      {view==="grid" && (<>
        {IS_LIVE && (
          <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" style={{display:"block",marginBottom:14,textDecoration:"none"}}>
            <div style={{padding:"12px 18px",borderRadius:10,background:"linear-gradient(135deg,#ff000018,#ff4d4d0a)",border:"1px solid #ff000055",display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden",cursor:"pointer"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#ff0000,#ff6b6b)"}}/>
              <div style={{position:"relative",flexShrink:0}}><div style={{width:12,height:12,borderRadius:"50%",background:"#ff0000"}} className="live-ping"/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                  <span style={{fontSize:10,fontWeight:800,color:"#ff4d4d",letterSpacing:2,textTransform:"uppercase"}}>● Live Now</span>
                  <span style={{fontSize:10,color:"#ffffff33",textTransform:"uppercase",letterSpacing:1}}>{LIVE_PLATFORM === "facebook" ? "Facebook Live" : "YouTube Live"}</span>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#ffe0e0"}}>{LIVE_TITLE}</div>
              </div>
              {LIVE_PLATFORM === "facebook"
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                : <svg width="22" height="16" viewBox="0 0 24 17" fill="#ff0000"><path d="M23.495 2.205a3.02 3.02 0 0 0-2.122-2.136C19.505 0 12 0 12 0S4.495 0 2.627.069A3.02 3.02 0 0 0 .505 2.205 31.247 31.247 0 0 0 0 8.005a31.247 31.247 0 0 0 .505 5.8 3.02 3.02 0 0 0 2.122 2.136C4.495 16.01 12 16.01 12 16.01s7.505 0 9.373-.069a3.02 3.02 0 0 0 2.122-2.136A31.247 31.247 0 0 0 24 8.005a31.247 31.247 0 0 0-.505-5.8zM9.609 11.386V4.624l6.264 3.381-6.264 3.381z"/></svg>
              }
              <div style={{fontSize:11,color:"#ff6b6b",fontWeight:600,whiteSpace:"nowrap"}}>Watch →</div>
            </div>
          </a>
        )}

        {/* Social Links */}
        <div style={{display:"flex",gap:10,marginBottom:22,flexWrap:"wrap"}}>
          <a href="https://www.facebook.com/profile.php?id=61589569536616" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:9,padding:"10px 18px",borderRadius:10,background:"#ffffff07",border:"1px solid #1877f222",textDecoration:"none",flex:"1 1 180px",cursor:"pointer"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontSize:12,fontWeight:700,color:"#e0eeff"}}>Michigan Pulse</div>{IS_LIVE && LIVE_PLATFORM==="facebook" && <span style={{fontSize:9,fontWeight:800,color:"#ff4d4d",background:"#ff000022",border:"1px solid #ff000044",borderRadius:10,padding:"1px 6px",letterSpacing:1}}>LIVE</span>}</div>
              <div style={{fontSize:10,color:"#ffffff44"}}>Follow Michigan Pulse</div>
            </div>
          </a>

        </div>

        {/* GEO POLL */}
        <PollWidget poll={activePoll} />

        {/* Stats */}
        <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
          {[
            {label:"Officials Tracked",val:OFFICIALS.length,color:BLUE},
            {label:"Total Votes",val:Object.values(votes).reduce((a,b)=>typeof b==='object'&&b.count?a+b.count:a,0),color:GREEN},
            {label:"Comments",val:Object.values(comments).reduce((a,b)=>a+b.length,0),color:BLUE},
            {label:"AI Analyses",val:Object.keys(aiData).length,color:GREEN},
          ].map(s=>(
            <div key={s.label} style={{flex:"1 1 130px",background:C.card,border:`1px solid ${s.color}1e`,borderRadius:10,padding:"12px 16px"}}>
              <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.val}</div>
              <div style={{fontSize:9,color:C.sub,marginTop:2,textTransform:"uppercase",letterSpacing:1.2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH + DROPDOWNS */}
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:"1 1 200px"}}>
            <svg style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",opacity:.4}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e0eeff" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search officials by name or title..."
              style={{...selectStyle,width:"100%",paddingLeft:30}}/>
          </div>
          <select value={cityFilter} onChange={e=>{setCityFilter(e.target.value);setChamberFilter("All");setCountyFilter("");}} style={{...selectStyle,flex:"1 1 150px"}}>
            {CITIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={countyFilter} onChange={e=>{setCountyFilter(e.target.value);setChamberFilter("All");setCityFilter("");}} style={{...selectStyle,flex:"1 1 150px"}}>
            {COUNTIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {(cityFilter||countyFilter||searchQuery) && (
            <button className="btn" onClick={()=>{setCityFilter("");setCountyFilter("");setSearchQuery("");}} style={{padding:"7px 14px",borderRadius:8,background:"#ffffff0a",border:"1px solid #ffffff15",color:"#ffffff66",fontSize:11,cursor:"pointer"}}>✕ Clear</button>
          )}
        </div>

        {/* Chamber Filter Pills */}
        <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          {CHAMBERS.map(ch=>(
            <button key={ch} className="pill" onClick={()=>{setChamberFilter(ch);setCityFilter("");setCountyFilter("");setSearchQuery("");}} style={{padding:"5px 13px",borderRadius:18,fontSize:11,fontWeight:600,background:chamberFilter===ch&&!cityFilter&&!countyFilter&&!searchQuery?`linear-gradient(90deg,#0077bb,#28a05e)`:"#ffffff08",color:chamberFilter===ch&&!cityFilter&&!countyFilter&&!searchQuery?"#fff":"#ffffff55",border:`1px solid ${chamberFilter===ch&&!cityFilter&&!countyFilter&&!searchQuery?"transparent":"#ffffff12"}`}}>{ch}</button>
          ))}
        </div>

        {/* Results count */}
        {(cityFilter||countyFilter||searchQuery) && (
          <div style={{fontSize:11,color:"#ffffff44",marginBottom:12}}>{filtered.length} official{filtered.length!==1?"s":""} found</div>
        )}

        {/* Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(248px,1fr))",gap:12}}>
          {filtered.map((o,i)=>{
            const overall=getOverall(o.id);
            const ai=aiData[o.id];
            const pc=partyColor(o.party);
            return(
              <div key={o.id} className="card fu" style={{animationDelay:`${i*.03}s`,background:C.card,border:C.border,borderRadius:12,padding:16,position:"relative",overflow:"hidden"}} onClick={()=>{setSelId(o.id);setView("detail");}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${pc}99,${pc}11)`}}/>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
                  <div style={{width:42,height:42,borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle,${pc}2e 0%,${pc}0e 100%)`,border:`2px solid ${pc}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:pc}}>{o.image}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:"#e4f0ff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.name}</div>
                    <div style={{fontSize:10,color:C.sub,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.title}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:9,color:"#ffffff2a",textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Score</div>
                    {overall!==null
                      ? <div style={{display:"flex",alignItems:"baseline",gap:2}}><span style={{fontSize:28,fontWeight:800,color:scoreColor(overall)}}>{overall}</span><span style={{fontSize:11,color:"#ffffff2a"}}>/100</span></div>
                      : <span style={{fontSize:11,color:"#ffffff1a",fontStyle:"italic"}}>No votes</span>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    {ai && <div style={{fontSize:10,fontWeight:700,color:sentColor(ai.sentiment),textTransform:"capitalize",marginBottom:2}}>{ai.sentiment}</div>}
                    <div style={{fontSize:9,color:"#ffffff1a"}}>Tap to rate →</div>
                  </div>
                </div>
                {overall!==null && <div style={{marginTop:10,height:3,background:"#ffffff07",borderRadius:2,overflow:"hidden"}}><div className="bar" style={{height:"100%",width:`${overall}%`,background:`linear-gradient(90deg,#0077bb,${GREEN})`,borderRadius:2}}/></div>}
                <div style={{marginTop:7,fontSize:9,color:`${pc}66`,textTransform:"uppercase",letterSpacing:.8}}>{partyLabel(o.party)}</div>
              </div>
            );
          })}
          {filtered.length===0 && (
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 0",color:"#ffffff22",fontSize:14}}>No officials found matching your search.</div>
          )}
        </div>
      </>)}

      {view==="detail" && official && (()=>{
        const pc=partyColor(official.party);
        return(
          <div className="fu">
            <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:24,padding:"18px 22px",background:C.card,border:`1px solid ${pc}22`,borderRadius:12,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${pc},transparent)`}}/>
              <div style={{width:64,height:64,borderRadius:"50%",flexShrink:0,background:`radial-gradient(circle,${pc}3a 0%,${pc}0e 100%)`,border:`2px solid ${pc}66`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:pc}}>{official.image}</div>
              <div>
                <h2 style={{fontSize:24,fontWeight:900,color:"#e4f0ff",letterSpacing:"-.3px"}}>{official.name}</h2>
                <div style={{fontSize:12,color:C.sub,marginTop:3}}>{official.title} · {partyLabel(official.party)} · {official.chamber}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{background:C.card,border:`1px solid ${BLUE}22`,borderRadius:12,padding:20}}>
                <h3 style={{fontSize:15,fontWeight:700,color:BLUE,marginBottom:16}}>Rate This Official</h3>
                <div style={{display:"flex",gap:5,marginBottom:16,flexWrap:"wrap"}}>
                  {CATEGORIES.map(c=>(
                    <button key={c.id} className="pill" onClick={()=>setSelCat(c.id)} style={{padding:"4px 11px",borderRadius:18,fontSize:10,fontWeight:600,background:selCat===c.id?`linear-gradient(90deg,#0077bb,#28a05e)`:"#ffffff08",color:selCat===c.id?"#fff":"#ffffff44",border:`1px solid ${selCat===c.id?"transparent":"#ffffff10"}`}}>{c.icon} {c.label}</button>
                  ))}
                </div>
                {(()=>{
                  const s=getScore(official.id,selCat);
                  const key=`${official.id}_${selCat}`;
                  const mv=userVotes[key];
                  return(
                    <div>
                      {s!==null&&<div style={{marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:C.sub}}>Community Score</span><span style={{fontSize:12,fontWeight:700,color:scoreColor(s)}}>{s}/100</span></div>
                        <div style={{height:5,background:C.faint,borderRadius:3,overflow:"hidden"}}><div className="bar" style={{height:"100%",width:`${s}%`,borderRadius:3,background:`linear-gradient(90deg,#0077bb,${scoreColor(s)})`}}/></div>
                        <div style={{fontSize:9,color:"#ffffff1e",marginTop:4}}>{votes[key]?.count||0} votes</div>
                      </div>}
                      <div style={{fontSize:11,color:C.sub,marginBottom:9}}>{mv?`Your vote: ${mv*10}/100`:"Cast your vote (1–10):"}</div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                          <button key={n} className="btn" onClick={()=>castVote(official.id,selCat,n)} style={{width:34,height:34,borderRadius:6,background:mv===n?`linear-gradient(135deg,#0077bb,#28a05e)`:"#ffffff08",color:mv===n?"#fff":n<=3?"#ff4d4d":n<=6?"#f59e0b":GREEN,fontSize:12,fontWeight:700,border:`1px solid ${mv===n?"transparent":"#ffffff12"}`}}>{n}</button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                <div style={{marginTop:20,borderTop:"1px solid #ffffff08",paddingTop:16}}>
                  <div style={{fontSize:9,color:"#ffffff2a",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>All Categories</div>
                  {CATEGORIES.map(c=>{
                    const s=getScore(official.id,c.id);
                    return(
                      <div key={c.id} style={{marginBottom:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:"#ffffff44"}}>{c.icon} {c.label}</span><span style={{fontSize:10,color:s!==null?scoreColor(s):"#ffffff1a",fontWeight:600}}>{s!==null?`${s}/100`:"—"}</span></div>
                        <div style={{height:3,background:"#ffffff07",borderRadius:2,overflow:"hidden"}}>{s!==null&&<div className="bar" style={{height:"100%",width:`${s}%`,borderRadius:2,background:`linear-gradient(90deg,#0077bb88,${GREEN}88)`}}/>}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {aiData[official.id]?(()=>{
                  const a=aiData[official.id];
                  return(
                    <div style={{background:"#020d07",border:`1px solid ${GREEN}2a`,borderRadius:12,padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <h3 style={{fontSize:13,fontWeight:700,color:GREEN}}>AI Sentiment Analysis</h3>
                        <span style={{fontSize:8,color:`${GREEN}55`,textTransform:"uppercase",letterSpacing:1.5}}>Claude-powered</span>
                      </div>
                      <div style={{display:"flex",gap:9,marginBottom:11,alignItems:"center",flexWrap:"wrap"}}>
                        <div style={{padding:"3px 11px",borderRadius:18,fontSize:10,fontWeight:700,background:`${sentColor(a.sentiment)}15`,color:sentColor(a.sentiment),border:`1px solid ${sentColor(a.sentiment)}33`,textTransform:"capitalize"}}>{a.sentiment}</div>
                        <div style={{fontSize:11,color:C.sub}}>Approval: <span style={{color:sentColor(a.sentiment),fontWeight:700}}>{a.score}%</span></div>
                      </div>
                      <p style={{fontSize:11,color:"#ffffff66",lineHeight:1.65,marginBottom:11}}>{a.summary}</p>
                      {a.themes?.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{a.themes.map((t,i)=><span key={i} style={{fontSize:9,padding:"2px 9px",borderRadius:9,background:`${GREEN}0d`,color:`${GREEN}aa`,border:`1px solid ${GREEN}1a`}}>{t}</span>)}</div>}
                    </div>
                  );
                })():analyzing===official.id?<div style={{background:"#020d07",border:`1px solid ${GREEN}1a`,borderRadius:12,padding:16}}><div className="glowing" style={{fontSize:11,color:`${GREEN}77`}}>🤖 AI analyzing feedback...</div></div>:null}
                <div style={{background:C.card,border:`1px solid ${BLUE}22`,borderRadius:12,padding:18,flex:1}}>
                  <h3 style={{fontSize:13,fontWeight:700,color:BLUE,marginBottom:12}}>Public Feedback</h3>
                  <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your thoughts on this official's performance..." style={{width:"100%",background:"#ffffff07",border:`1px solid ${BLUE}1e`,borderRadius:7,padding:"9px 11px",color:"#d8eeff",fontSize:11,resize:"vertical",minHeight:76,outline:"none",lineHeight:1.55,fontFamily:"inherit"}}/>
                  <button className="btn" onClick={()=>submitComment(official.id)} style={{marginTop:9,padding:"8px 16px",borderRadius:6,background:comment.trim()?`linear-gradient(90deg,#0077bb,#28a05e)`:"#ffffff09",color:comment.trim()?"#fff":"#ffffff2a",fontSize:11,fontWeight:600}}>Submit &amp; Analyze with AI</button>
                  <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8,maxHeight:210,overflowY:"auto"}}>
                    {!(comments[official.id]?.length)&&<div style={{fontSize:11,color:"#ffffff1a",fontStyle:"italic"}}>No comments yet — be the first.</div>}
                    {(comments[official.id]||[]).map(c=>(
                      <div key={c.id} style={{background:"#ffffff07",borderRadius:7,padding:"9px 11px",border:"1px solid #ffffff07"}}>
                        <p style={{fontSize:11,color:"#c8e0ff",lineHeight:1.55}}>{c.text}</p>
                        <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center"}}>
                          {c.username && <span style={{fontSize:9,color:BLUE,fontWeight:600}}>@{c.username}</span>}
                          <span style={{fontSize:9,color:"#ffffff1e"}}>{new Date(c.ts).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      </main>

      {authModal && (
        <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.75)",backdropFilter:"blur(8px)"}} onClick={()=>setAuthModal(false)}>
          <div style={{background:"#0a0f1a",border:`1px solid ${BLUE}33`,borderRadius:16,padding:"32px 28px",width:"100%",maxWidth:400,position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setAuthModal(false)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"#ffffff44",fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
            <div style={{textAlign:"center",marginBottom:24}}>
              <Logo size={56}/>
              <div style={{marginTop:12,fontSize:20,fontWeight:900,background:`linear-gradient(90deg,${BLUE},${GREEN})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Michigan Pulse</div>
              <div style={{fontSize:12,color:"#ffffff44",marginTop:4}}>Your voice. Your officials. Your pulse.</div>
            </div>
            <div style={{display:"flex",gap:0,marginBottom:22,background:"#ffffff08",borderRadius:8,padding:3}}>
              {['login','signup'].map(t=>(
                <button key={t} onClick={()=>{setAuthTab(t);setAuthError('');}} style={{flex:1,padding:"7px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:authTab===t?`linear-gradient(90deg,#0077bb,#28a05e)`:"transparent",color:authTab===t?"#fff":"#ffffff55",textTransform:"capitalize",letterSpacing:.5}}>{t==='login'?'Sign In':'Create Account'}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
              <button className="btn" onClick={()=>handleSocialAuth('google')} disabled={authLoading} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 0",borderRadius:8,border:"1px solid #ffffff18",background:"#ffffff0a",color:"#e0eeff",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <button disabled style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 0",borderRadius:8,border:"1px solid #ffffff0a",background:"#ffffff05",color:"#ffffff33",fontSize:13,fontWeight:600,cursor:"default"}}>
                <svg width="16" height="18" viewBox="0 0 814 1000" fill="#ffffff33"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-150.3-92.8C87 316.7 32 280.1 32 214.5 32 130.9 98.9 88 98.9 88c47.3-27.8 126.1-27.8 142.6-27.8 75.8 0 137.9 40.4 166.5 61.6 28.5 21.2 107.3 61.6 167.6 61.6 60.3 0 138.7-42.2 165.9-61.6z"/></svg>
                Apple Sign-In — Coming Soon
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{flex:1,height:1,background:"#ffffff12"}}/>
              <span style={{fontSize:10,color:"#ffffff33",textTransform:"uppercase",letterSpacing:1}}>or</span>
              <div style={{flex:1,height:1,background:"#ffffff12"}}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {authTab==='signup' && <input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Your full name" style={{background:"#ffffff09",border:`1px solid ${BLUE}22`,borderRadius:7,padding:"10px 12px",color:"#e0eeff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
              {authTab==='signup' && <input value={authUsername} onChange={e=>setAuthUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} placeholder="Username (e.g. LapeerVoter)" style={{background:"#ffffff09",border:`1px solid ${BLUE}22`,borderRadius:7,padding:"10px 12px",color:"#e0eeff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>}
              <input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="Email address" type="email" style={{background:"#ffffff09",border:`1px solid ${BLUE}22`,borderRadius:7,padding:"10px 12px",color:"#e0eeff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              <input value={authPass} onChange={e=>setAuthPass(e.target.value)} placeholder="Password" type="password" onKeyDown={e=>e.key==='Enter'&&handleEmailAuth(authTab)} style={{background:"#ffffff09",border:`1px solid ${BLUE}22`,borderRadius:7,padding:"10px 12px",color:"#e0eeff",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
              {authError && <div style={{fontSize:11,color:"#ff6b6b",padding:"6px 10px",background:"#ff000011",borderRadius:5,border:"1px solid #ff000022"}}>{authError}</div>}
              <button className="btn" onClick={()=>handleEmailAuth(authTab)} disabled={authLoading} style={{marginTop:4,padding:"11px 0",borderRadius:8,background:authLoading?"#ffffff14":`linear-gradient(90deg,#0077bb,#28a05e)`,color:authLoading?"#ffffff44":"#fff",fontSize:13,fontWeight:700,border:"none",cursor:authLoading?"default":"pointer"}}>
                {authLoading ? 'Please wait...' : authTab==='login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>
            <div style={{marginTop:16,textAlign:"center",fontSize:11,color:"#ffffff33"}}>
              {authTab==='login' ? "Don't have an account? " : "Already have an account? "}
              <span style={{color:BLUE,cursor:"pointer",fontWeight:600}} onClick={()=>{setAuthTab(authTab==='login'?'signup':'login');setAuthError('');}}>{authTab==='login'?'Sign up':'Sign in'}</span>
            </div>
          </div>
        </div>
      )}

      {/* USERNAME MODAL */}
      {usernameModal && (
        <div style={{position:"fixed",inset:0,zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)"}}>
          <div style={{background:"#0a0f1a",border:`1px solid ${BLUE}33`,borderRadius:16,padding:"32px 28px",width:"100%",maxWidth:380,position:"relative"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:36,marginBottom:8}}>👤</div>
              <div style={{fontSize:20,fontWeight:900,background:`linear-gradient(90deg,${BLUE},${GREEN})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Choose a Username</div>
              <div style={{fontSize:12,color:"#ffffff44",marginTop:8,lineHeight:1.5}}>Pick a unique username that will appear on your comments. You can't change this later.</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#ffffff44",fontSize:14,fontWeight:600}}>@</span>
                <input
                  value={newUsername}
                  onChange={e=>setNewUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))}
                  placeholder="YourUsername"
                  maxLength={20}
                  onKeyDown={e=>e.key==='Enter'&&saveUsername()}
                  style={{background:"#ffffff09",border:`1px solid ${BLUE}22`,borderRadius:7,padding:"10px 12px 10px 28px",color:"#e0eeff",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%"}}
                />
              </div>
              <div style={{fontSize:10,color:"#ffffff33"}}>Letters, numbers, underscores only. Min 3 characters.</div>
              {usernameError && <div style={{fontSize:11,color:"#ff6b6b",padding:"6px 10px",background:"#ff000011",borderRadius:5,border:"1px solid #ff000022"}}>{usernameError}</div>}
              <button className="btn" onClick={saveUsername} disabled={usernameLoading}
                style={{marginTop:4,padding:"11px 0",borderRadius:8,background:usernameLoading?"#ffffff14":`linear-gradient(90deg,#0077bb,#28a05e)`,color:usernameLoading?"#ffffff44":"#fff",fontSize:13,fontWeight:700,border:"none",cursor:usernameLoading?"default":"pointer"}}>
                {usernameLoading ? 'Checking...' : 'Set Username'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CARTOON MODAL */}
      {cartoonUrl && (
        <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.85)",backdropFilter:"blur(10px)"}}>
          <div style={{position:"relative",borderRadius:16,overflow:"hidden",boxShadow:"0 0 60px #00aaff33",border:`1px solid ${BLUE}33`}}>
            <div style={{position:"relative"}}>
              <video
                src={cartoonUrl}
                autoPlay
                playsInline
                style={{display:"block",maxWidth:"90vw",maxHeight:"80vh",borderRadius:16}}
                onEnded={()=>{setCartoonUrl(null);setVideoBlocked(false);}}
                ref={el => {
                  if(el) {
                    el.play().then(()=>setVideoBlocked(false)).catch(()=>{
                      el.muted=true;
                      el.play().catch(()=>{});
                      setVideoBlocked(true);
                    });
                  }
                }}
              />
              {videoBlocked && (
                <div onClick={e=>{
                  const vid = e.currentTarget.previousSibling;
                  vid.muted=false;
                  vid.play().catch(()=>{});
                  setVideoBlocked(false);
                }} style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.6)",borderRadius:16,cursor:"pointer"}}>
                  <div style={{fontSize:48}}>🔊</div>
                  <div style={{color:"#fff",fontWeight:700,fontSize:16,marginTop:8}}>Tap to play with sound</div>
                </div>
              )}
            </div>
            <button onClick={()=>{setCartoonUrl(null);setVideoBlocked(false);}} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.5)",border:"none",color:"#fff",fontSize:18,width:30,height:30,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${BLUE},${GREEN})`}}/>
          </div>
        </div>
      )}
    </div>
  );
}
