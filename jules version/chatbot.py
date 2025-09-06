import os
import warnings
from dotenv import load_dotenv

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

def create_vector_store(data_path, vector_store_path="faiss_index"):
    """
    Creates and saves a FAISS vector store from the documents in the data directory.
    If the vector store already exists, it loads it.
    """
    if os.path.exists(vector_store_path):
        print("Loading existing vector store...")
        return FAISS.load_local(vector_store_path, embeddings, allow_dangerous_deserialization=True)

    print("Creating new vector store...")
    # Load the documents
    loader = TextLoader(data_path)
    documents = loader.load()

    # Split the documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    # Create the vector store
    vector_store = FAISS.from_documents(docs, embeddings)
    vector_store.save_local(vector_store_path)
    print("Vector store created and saved.")
    return vector_store

def create_rag_chain(vector_store):
    """
    Creates a RAG chain with a retriever and a custom prompt.
    """
    # Create the retriever
    retriever = vector_store.as_retriever()

    # Create the prompt template
    prompt_template = """
    **Disclaimer: This is a helpful assistant for identifying water-borne diseases based on the provided context. It is not a substitute for professional medical advice. Always consult a doctor for any health concerns.**

    Based on the following context, please answer the user's question. If the context does not contain the answer, state that you don't have enough information.

    Context:
    {context}

    Question:
    {input}

    Answer:
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)

    # Create the RAG chain
    rag_chain = (
        {"context": retriever, "input": RunnablePassthrough()}
        | create_stuff_documents_chain(llm, prompt)
    )
    return rag_chain

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    groq_api_key = os.getenv("GROQ_API_KEY")

    if not groq_api_key:
        print("Error: GROQ_API_KEY not found. Please set it in the .env file.")
    else:
        # Initialize embeddings and LLM
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        llm = ChatGroq(temperature=0, groq_api_key=groq_api_key, model_name="llama3-8b-8192")

        # Create or load the vector store
        vector_store = create_vector_store("data/diseases.txt")

        # Create the RAG chain
        rag_chain = create_rag_chain(vector_store)

        # Start the chat
        print("\n--- Water-Borne Disease Chatbot ---")
        print("I can help you identify potential water-borne diseases based on your symptoms.")
        print("Type 'exit' or 'quit' to end the chat.")
        print("-" * 35)

        while True:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                print("Chatbot: Goodbye!")
                break

            # Get the response from the RAG chain
            response = rag_chain.invoke(user_input)
            print(f"Chatbot: {response}")
