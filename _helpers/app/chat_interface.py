import streamlit as st
from chat_gpt_connector import ChatGPTConnector
from ui_helpers import setup_ui, get_user_input
from agent.MemoryManager import MemoryManager


class ChatInterface:
    def __init__(self):
        setup_ui()

        # Use session_state to store the connector and MemoryManager
        if "connector" not in st.session_state:
            st.session_state["connector"] = ChatGPTConnector()

        # Initialize MemoryManager
        if "memory_manager" not in st.session_state:
            st.session_state["memory_manager"] = MemoryManager(model="gpt-3.5-turbo")

        self.chat_window = st.empty()

    def run(self):
        user_message = get_user_input()
        if st.button("Send"):
            # User message
            st.session_state["memory_manager"].add_message("user", user_message)

            # Bot response
            bot_response = st.session_state["connector"].get_response(user_message)
            st.session_state["memory_manager"].add_message("assistant", bot_response)

            # Display the conversation
            conversation_html = st.session_state[
                "memory_manager"
            ].display_conversation_html()
            self.chat_window.markdown(conversation_html, unsafe_allow_html=True)
