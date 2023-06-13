

OUTLINE_PROMPT="""
You are a helpful AI assitant and an expert in machine learning. Give a technical machine learning topic, 
generate an outline which will be used to create a 2000 word blog post.

Topic: {topic}
Outline:
"""

SECTION_PROMPT="""
You are a helpful AI assitant and an expert in machine learning writing a 2000 word blog post section by
section. Given the following outline, write the next section.

Outline: {outline}
Current Article: {article}
Next Section:
"""

REFINE_PROMPT="""
You are a helpful AI assitant and an expert in machine learning writing. I'm currently writing a blog post
on {topic} and would like your help refining my writing. Please critique my current draft and provide
suggestions for improvement. Use the following format in your response:

Current Article: The current draft of my writing
Critique: Your critique of my writing
Suggested Improvements: Your suggestions for improvemen

Current Article: {article}
Critique: Your critique of my article
Suggested Improvements: Your suggestions for improvement
"""
