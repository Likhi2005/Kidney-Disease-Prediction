// Prediction page functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const noResults = document.getElementById('noResults');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const canvas = document.getElementById('canvas');

    // Drag and drop handlers
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect);
    analyzeBtn.addEventListener('click', performPrediction);

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.background = 'rgba(0, 212, 255, 0.15)';
        dropZone.style.borderColor = '#00d4ff';
        dropZone.style.transform = 'scale(1.02)';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.background = '';
        dropZone.style.borderColor = '';
        dropZone.style.transform = '';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.background = '';
        dropZone.style.borderColor = '';
        dropZone.style.transform = '';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    }

    function handleFileSelect() {
        const file = fileInput.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('Please select a valid image file');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);

        // Reset results
        resultsContainer.style.display = 'none';
        noResults.style.display = 'block';
    }

    async function performPrediction() {
        const file = fileInput.files[0];
        if (!file) {
            showError('Please select an image first');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        loadingSpinner.style.display = 'block';
        resultsContainer.style.display = 'none';
        noResults.style.display = 'none';

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onload = async function(e) {
                const base64Image = e.target.result.split(',')[1];

                try {
                    // Send to backend
                    const response = await fetch('/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: base64Image
                        })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        displayResults(data);
                    } else {
                        showError(data.message || 'Prediction failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showError('Network error. Please try again.');
                } finally {
                    analyzeBtn.disabled = false;
                    loadingSpinner.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error:', error);
            showError('Error processing image. Please try again.');
            analyzeBtn.disabled = false;
            loadingSpinner.style.display = 'none';
        }
    }

    function displayResults(data) {
        noResults.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Extract prediction results
        const prediction = data.prediction || {};
        const className = prediction.class || 'Unknown';
        const confidence = (prediction.confidence || 0) * 100;
        const otherConfidence = 100 - confidence;

        // Update classification
        document.getElementById('classificationResult').textContent = className;
        document.getElementById('confidenceValue').textContent = confidence.toFixed(2) + '%';

        // Update progress bar
        const progressBar = document.getElementById('confidenceBar');
        progressBar.style.width = confidence + '%';
        progressBar.textContent = confidence.toFixed(1) + '%';

        // Update metrics table
        const metricsBody = document.querySelector('#metricsTable tbody');
        metricsBody.innerHTML = `
            <tr>
                <td>Prediction Class</td>
                <td><strong>${className}</strong></td>
            </tr>
            <tr>
                <td>Confidence Score</td>
                <td><strong>${confidence.toFixed(2)}%</strong></td>
            </tr>
            <tr>
                <td>Model Certainty</td>
                <td>
                    <span class="badge" style="background: ${confidence > 70 ? '#00d4ff' : '#ffc107'}">
                        ${confidence > 70 ? 'High' : 'Moderate'}
                    </span>
                </td>
            </tr>
            <tr>
                <td>Prediction Time</td>
                <td>${(data.prediction_time || 0).toFixed(2)}s</td>
            </tr>
        `;

        // Add disclaimer
        const disclaimerDiv = document.createElement('div');
        disclaimerDiv.className = 'alert alert-warning mt-4';
        disclaimerDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Disclaimer:</strong> This prediction is for educational purposes only. 
            It should not be used for medical diagnosis or treatment decisions. 
            Always consult with qualified medical professionals.
        `;
        resultsContainer.appendChild(disclaimerDiv);

        // Animate results
        resultsContainer.classList.add('fade-in-up');
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${message}`;

        const alertContainer = document.querySelector('.container') || document.body;
        alertContainer.insertBefore(errorDiv, alertContainer.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);

        analyzeBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    }

    // Add to window for debugging
    window.predictApp = {
        dropZone,
        fileInput,
        analyzeBtn
    };
});