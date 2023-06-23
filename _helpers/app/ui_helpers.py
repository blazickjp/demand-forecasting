import streamlit as st


def setup_ui():
    st.title("Chat with ChatGPT")


def add_message_to_chat_window(message, chat_window):
    chat_window.markdown(message.render(), unsafe_allow_html=True)


def get_user_input():
    return st.text_area("Your Message", height=200)  # You can adjust the height
