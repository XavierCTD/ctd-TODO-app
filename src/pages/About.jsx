import { Link } from "react-router";

export default function About() {
    return (
        <div style={{ padding: "1rem" }}>
          <h2>About This App.</h2>
          <p>
            This is a TODO app. It can allow me to create, modify and edit<br />
            any list that I need. This app is referenced from the  Airtable site at <a href="https://www.airtable.com/lp/ai-psu-plp?utm_source=google&utm_medium=cpc&utm_extra5=kwd-325289323194&utm_extra2=936407691&utm_extra10=47735600558&creative=719486203908&utm_extra8=c&utm_term=airtable&utm_campaign=demand_br_brand_all_us_en&gad_source=1&gad_campaignid=936407691&gbraid=0AAAAADzRqnXJ2_iI8OYs0E4wJufVemibX&gclid=CjwKCAjwlt7GBhAvEiwAKal0cor070_R4adpTjgmVd3lKFvwVZcnHMdwlF8YvtYUMggIjeaCD7t26BoCvc0QAvD_BwE" target="_blank">www.airtable.com</a>.
          </p>
          <p>
            Author: Xavier Mcallister <br />  
            Date of Birth: 06, 21, 2001
          </p>
          <Link to="/">Return Home</Link>
        </div>
    )
}