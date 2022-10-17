# HCMS Lookup Template
Productivity API route template for CivicPlus HCMS lookup text based query.

## Expected Default Behavior
- Text input lookup button will query the specified HCMS, content type, and content field for matches.
- For each matching item in the HCMS, the API will return an Information form element with the ID of the matching item below the text input.

##  Pre-requisites
- Install [NodeJS and NPM](https://nodejs.org/en/download/)
- Install IDE of choice such as [Atom](https://atom.io/)
- Assumes basic understanding of [CivicPlus Productivity SDK](https://github.com/oneblink/sdk-js) and [CLI](https://github.com/oneblink/cli).
- Have a text file handy to copy/paste values from during setup.

## Installation and Setup
### Productivity API Setup
1. [Productivity Console](https://console.transform.civicplus.com/) --> API Tab --> Create new API Endpoint
- Copy URL to text file for later use.
2. Create development keys, if needed.
- Copy Key ID and Key Secret to text file for later use.

### HCMS Setup
1. Open [Client HCMS app](https://content.civicplus.com)
2. Navigate to Settings > Clients:
  - [Add new HCMS client](https://www.hcms.civicplus.help/hc/en-us/articles/360006841014):
    - Name: productivity
    - Role: Owner
    - Copy client id and secret to text file for later use.
3. Identify content type (i.e. department) and field (i.e. name) to query
  - Copy content-type name and field name to text file for later use.


### Project and API Route Setup
1. Clone template repository:
  ```sh
  git clone https://github.com/civicplus-civicoptimize/hcms-lookup-template.git
  cd hcms-lookup-template
  npm install @oneblink/sdk @oneblink/cli moment axios querystring --save
  ```
2. Set API scope (replace url with API url)
  ```sh
  civicplus api scope https://hosted.api.route.productivity.civicplus.com
  ```
3. Use the copied values from previous steps to update all relevant environmental variables blinkmrc.json file.

4. Update the data mapping (src/library/query-hcms.js) from HCMS to Productivity.

5. Update API route (src/routes/query.js) to return the necessary [Form Elements](https://github.com/oneblink/sdk-js/blob/master/docs/form-elements/README.md) as defined in the [CivicPlus Productivity SDK](https://github.com/oneblink/sdk-js).

6. Review and Deploy API to Productivity Hosting
  ```sh
  civicplus api deploy
  ```

### Productivity Lookup and Form Configuration
1. Console/Lookups/Add Lookup
  - Choose Element Lookup
  - Choose Hosted API
  - Lookup Label: HCMS Query - Content Type / Field
  - Hosted API: {client.api.URL}
  - Lookup url: /query
  - Save

2. Console/Forms/Add Form
  - Add Text Element
    - Label: HCMS Text Query
    - Name: query
    - [x] Enable Element Lookup
      - Element Lookup: HCMS Query - Content Type / Field

// This is my first comment!