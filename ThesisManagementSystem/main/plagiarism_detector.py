from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from PyPDF2 import PdfReader

def check_plagiarism(target, monographs_list):

    def get_data(doc):
        reader = PdfReader(doc)
        num_of_pages = reader.getNumPages()
        data = []

        for page in range(0, num_of_pages):
            page = reader.pages[0]
            data.append(page.extract_text())

        return(str(data))

    monographs_content = [get_data(doc=doc) for doc in monographs_list]

    vectorize = lambda Text: TfidfVectorizer().fit_transform(Text).toarray()
    similarity = lambda doc1, doc2: cosine_similarity([doc1, doc2])
    
    m_vectors = vectorize(monographs_content)

    paired_monographs_vectors = list(zip(monographs_list, m_vectors))

    def check_plagiarism_logic():
        results = set()
        for sample_a, text_vector_a in paired_monographs_vectors:
            new_vectors = paired_monographs_vectors.copy()
            current_index = new_vectors.index((sample_a, text_vector_a))
            del new_vectors[current_index]
            if sample_a == target:
                for sample_b, text_vector_b in new_vectors:
                    sim_score = similarity(text_vector_a, text_vector_b)[0][1]
                    score = sample_a, sample_b, sim_score
                    if sim_score >= 0.25:
                        results.add(score)
                        
        return results

    final_result = []
    for data in check_plagiarism_logic():
        final_result.append(data) 

    return final_result