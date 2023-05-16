from langchain.agents import BaseSingleActionAgent
from langchain.tools.base import BaseTool
import requests
from bs4 import BeautifulSoup
import re

import tinycss2


def parse_css(css_text):
    # Parse the CSS
    parsed_css = tinycss2.parse_stylesheet(css_text)

    # Initialize an empty dictionary to hold the CSS rules
    css_rules = {}

    # Loop through the parsed CSS
    for rule in parsed_css:
        if rule.type == 'qualified-rule':
            # Get the selector
            selector = tinycss2.serialize(rule.prelude)

            # Initialize an empty dictionary to hold the declarations for this rule
            declarations = {}

            # Parse the declarations
            parsed_declarations = tinycss2.parse_declaration_list(rule.content)
            for declaration in parsed_declarations:
                if declaration.type == 'declaration':
                    # Get the property name
                    property_name = declaration.lower_name

                    # Get the property value
                    property_value = tinycss2.serialize(declaration.value)

                    # Add the declaration to the dictionary
                    declarations[property_name] = property_value

            # Add the rule to the dictionary
            css_rules[selector] = declarations

    # Convert the CSS rules to a format that can be used as a React theme
    # react_theme = convert_css_to_react_theme(css_rules)

    return css_rules


def convert_css_to_react_theme(css_rules):
    # This function should convert the CSS rules into a format that can be used as a React theme
    # The exact implementation will depend on the theming library you're using and the structure of your React application
    pass


def scrape_css(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all style tags and print their contents
    for style in soup.find_all('style'):
        print(style.text)

    # Find all link tags that link to CSS files and print their href
    for link in soup.find_all('link', rel='stylesheet'):
        css_url = link.get('href')
        if css_url:
            if 'http' not in css_url:
                # If it's a relative link, add the base URL
                css_url = url + css_url
            print(f'Linked CSS: {css_url}')
            css_response = requests.get(css_url)
            print(css_response.text)


# Replace 'url' with the URL of the webpage you want to scrape
css = scrape_css('https://platform.openai.com/playground')
parse_css(css)


class WebScrapingTool(BaseTool):
    def execute(self, url):
        # Implement your web scraping logic here
        pass


class CSSParsingTool(BaseTool):
    def execute(self, css):
        # Implement your CSS parsing logic here
        pass


class ReactThemeGenerationTool(BaseTool):
    def execute(self, css_rules):
        # Implement your React theme generation logic here
        pass


class WebScrapingAgent(BaseSingleActionAgent):
    def plan(self, url):
        web_scraping_tool = WebScrapingTool()
        css_parsing_tool = CSSParsingTool()
        react_theme_generation_tool = ReactThemeGenerationTool()

        css = web_scraping_tool.execute(url)
        css_rules = css_parsing_tool.execute(css)
        react_theme = react_theme_generation_tool.execute(css_rules)

        return react_theme
