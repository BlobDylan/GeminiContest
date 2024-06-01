import os
import google.generativeai as geni

INDEX_FILE_PATH = "./tempapp/index.html"
STYLES_FILE_PATH = "./tempapp/styles.css"
SCRIPT_FILE_PATH = "./tempapp/script.js"
INPUT = "Binary Search"

first_turn = True

key = os.environ.get('GEMINI_API_KEY')

geni.configure(api_key=key)

instruction = (
    "You are a coding expert that specializes in front end interfaces. When I describe a topic, for which I "
    "want you to make a simple web app that will best explain it in a visual way,"
    "please do your best at making this application in a visually appealing manner and return the HTML contents "
    "of index.html, the CSS contents of styles.css and the contents of script.js in that order. Do not give an "
    "explanation for your code. If you are given source code simply edit it. Do not give an explenation for your changes."
)
hist = [{
    'role' : 'user',
    'parts' : [INPUT]
}]
model = geni.GenerativeModel('gemini-1.5-flash',system_instruction=instruction)
response = model.generate_content(hist)

while True:
    if first_turn:
        first_turn = False
    else:
        hist.append({'role' : 'user', 'parts' : [input("Enter correction: ")]})
        response = model.generate_content(hist)

    hist.append({'role' : 'model', 'parts' : [response.text]})
    components = response.text.split("```")
    components = [component.strip() for component in components if component.strip()]

    html_string = components[0]
    css_string = components[1]
    js_string = components[2]

    with open(INDEX_FILE_PATH,'w') as html_writer:
        html_writer.write(html_string.removeprefix('html\n'))

    with open(STYLES_FILE_PATH,'w') as css_writer:
        css_writer.write(css_string.removeprefix('css\n'))

    with open(SCRIPT_FILE_PATH,'w') as js_writer:
        js_writer.write(js_string.removeprefix('js\n'))