# Kidney-Disease-Classification-MLflow-DVC


## Workflows

1. Update config.yaml
2. Update secrets.yaml [Optional]
3. Update params.yaml
4. Update the entity
5. Update the configuration manager in src config
6. Update the components
7. Update the pipeline
8. Update the main.py
9. Update the dvc.yaml
10. app.py

# How to run?
### STEPS:

Clone the repository

```bash
https://github.com/Likhi2005/Kidney-Disease-Prediction
```
### STEP 01- Create a conda environment after opening the repository

```bash
cd Kidney-Disease-Prediction
```

```bash
conda create -n kidneyCnn python=3.10.19 -y
```

```bash
conda activate kidneyCnn
```

### STEP 02- install the requirements
```bash
pip install -r requirements.txt
```

```bash
# Finally run the following command
python app.py
```

Now,
```bash
open your local host and port
```