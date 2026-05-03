document.addEventListener('DOMContentLoaded', () => {
    const btnUpload = document.getElementById('btn-upload');
    const fileInput = document.getElementById('resume-file-input');
    const uploadStatus = document.getElementById('upload-status');
    const inputTitles = document.getElementById('input-titles');
    const selectExperience = document.getElementById('select-experience');
    const inputLocation = document.getElementById('input-location');
    const navAnalysis = document.getElementById('nav-analysis');
    const navJobs = document.getElementById('nav-jobs');
    const btnMainAction = document.getElementById('btn-main-action');

    let isFileUploaded = false;

    const updateUI = () => {
        const hasTitles = inputTitles.value.trim().length > 0;
        const hasExperience = selectExperience.value !== "";
        const hasLocation = inputLocation.value.trim().length > 0;

        const isFormValid = isFileUploaded && hasTitles && hasExperience && hasLocation;

        if (isFormValid) {
            navAnalysis.classList.remove('nav-link-disabled');
            navJobs.classList.remove('nav-link-disabled');
            btnMainAction.classList.remove('nav-link-disabled');
        } else {
            navAnalysis.classList.add('nav-link-disabled');
            navJobs.classList.add('nav-link-disabled');
            btnMainAction.classList.add('nav-link-disabled');
        }
    };

    btnUpload.addEventListener('click', () => {
        fileInput.click();
    });

    const btnViewResume = document.getElementById('btn-view-resume');
    const btnDeleteResume = document.getElementById('btn-delete-resume');
    const resumeActionRow = document.getElementById('resume-action-row');
    let uploadedFileUrl = null;

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            isFileUploaded = true;
            const file = e.target.files[0];
            const fileName = file.name;
            
            // UI Feedback
            const uploadZone = document.querySelector('.resume-upload-zone');
            if (uploadZone) uploadZone.classList.add('uploaded');
            
            btnUpload.classList.remove('bg-primary', 'border-primary', 'hover:bg-white', 'hover:text-primary');
            btnUpload.classList.add('bg-green-600', 'border-green-600', 'hover:bg-green-700', 'hover:border-green-700', 'text-white');
            
            // Update icon to checkmark
            const icon = btnUpload.querySelector('.material-symbols-outlined');
            if (icon) icon.textContent = 'check_circle';

            uploadStatus.textContent = fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName;
            
            // Show action row (View + Delete)
            resumeActionRow.classList.remove('hidden');
            if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
            uploadedFileUrl = URL.createObjectURL(file);

            updateUI();
        }
    });

    btnViewResume.addEventListener('click', () => {
        if (uploadedFileUrl) {
            window.open(uploadedFileUrl, '_blank');
        }
    });

    btnDeleteResume.addEventListener('click', () => {
        // Reset file input
        fileInput.value = '';
        isFileUploaded = false;

        // Revoke object URL
        if (uploadedFileUrl) {
            URL.revokeObjectURL(uploadedFileUrl);
            uploadedFileUrl = null;
        }

        // Reset upload zone styling
        const uploadZone = document.querySelector('.resume-upload-zone');
        if (uploadZone) uploadZone.classList.remove('uploaded');

        // Reset upload button styling back to default
        btnUpload.classList.remove('bg-green-600', 'border-green-600', 'hover:bg-green-700', 'hover:border-green-700');
        btnUpload.classList.add('bg-primary', 'border-primary', 'hover:bg-white', 'hover:text-primary', 'text-white');

        // Reset icon back to upload
        const icon = btnUpload.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'upload_file';

        // Reset status text
        uploadStatus.textContent = 'Select File';

        // Hide action row
        resumeActionRow.classList.add('hidden');

        // Re-validate form (will disable nav since no file)
        updateUI();
    });

    [inputTitles, selectExperience, inputLocation].forEach(el => {
        el.addEventListener('input', updateUI);
        el.addEventListener('change', updateUI);
    });

    // --- BACKEND INTEGRATION ---
    const loadingOverlay = document.getElementById('loading-overlay');

    btnMainAction.addEventListener('click', async (e) => {
        if (btnMainAction.classList.contains('nav-link-disabled')) return;

        // 1. Show Loading State
        loadingOverlay.style.display = 'flex';

        // 2. Prepare Data
        const formData = new FormData();
        formData.append('resume', fileInput.files[0]);
        formData.append('roles', inputTitles.value);
        formData.append('experience', selectExperience.value);
        formData.append('locations', inputLocation.value);
        formData.append('opportunityType', 'job'); 

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            // CRITICAL: Capture the body exactly once as text
            const rawBody = await response.text();
            
            let result = null;
            try {
                result = JSON.parse(rawBody);
            } catch (jsonErr) {
                console.error('Raw server response was not valid JSON:', rawBody);
            }

            // Handle Server Errors (4xx, 5xx)
            if (!response.ok) {
                const errorMsg = (result && result.error) ? result.error : `Server Error: ${response.status}`;
                throw new Error(errorMsg);
            }

            // Handle Success Logic
            if (result && result.success) {
                localStorage.setItem('career_analysis', JSON.stringify(result.data));
                
                if (window.navigateWithTransition) {
                    window.navigateWithTransition('/analysis_page/analysis.html', 'forward');
                } else {
                    window.location.href = '/analysis_page/analysis.html';
                }
            } else {
                const failMsg = (result && result.error) ? result.error : 'The AI analysis failed to process your resume.';
                throw new Error(failMsg);
            }

        } catch (error) {
            console.error('Fetch Error Detail:', error);
            alert('Analysis failed: ' + error.message);
            loadingOverlay.style.display = 'none';
        }
    });
});
