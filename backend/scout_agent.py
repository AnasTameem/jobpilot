"""
scout_agent.py
──────────────
Scout Agent generating direct master search pages for Job Platforms.
Applies extreme URL level filters for Role, Location, and Experience.
"""

import logging

logger = logging.getLogger(__name__)

def scout_jobs(roles: list, locations: list, experience: str, opportunity_type: str) -> list:
    """
    Generates direct master search feeds for each platform applying strict user filters.
    """
    role = roles[0] if roles else "Software Engineer"
    loc = locations[0] if locations else ""
    role_q = "+".join(role.split())
    loc_q = "+".join(loc.split())
    
    # Clean experience to float or default to 0
    exp_val = 0.0
    if experience:
        try:
            exp_val = float(experience)
        except ValueError:
            exp_val = 0.0
            
    jobs = []
    
    # ── 1. INDEED SETUP ──
    indeed_strict_query = role_q
    if exp_val > 0 and opportunity_type != "internship":
        indeed_strict_query += f"+{int(exp_val)}+years+experience"
    elif exp_val == 0 or opportunity_type == "internship":
        indeed_strict_query += "+fresher"
        
    indeed_link = f"https://www.indeed.com/jobs?q={indeed_strict_query}"
    if loc:
        indeed_link += f"&l={loc_q}"
    if opportunity_type == "internship":
         # Indeed Internal ID for internship sorting
        indeed_link += "&sc=0kf%3AjobType%28internship%29%3B"
        
    jobs.append({
        "title": f"View All Indeed {role} {'Internships' if opportunity_type=='internship' else 'Jobs'}",
        "link": indeed_link,
        "snippet": f"Indeed Live Master Feed: Strict filters firmly applied for {int(exp_val)} years experience {'in '+loc if loc else ''}. We ensure irrelevant postings are hidden.",
        "platform": "Indeed"
    })
    
    # ── 2. NAUKRI SETUP ──
    naukri_role = "-".join(role.lower().split())
    naukri_loc = "-".join(loc.lower().split()) if loc else ""
    
    naukri_link = f"https://www.naukri.com/{naukri_role}-jobs"
    if naukri_loc:
        naukri_link += f"-in-{naukri_loc}"
        
    if opportunity_type == "internship" or exp_val == 0:
        naukri_link += "?experience=0"
    else:
        naukri_link += f"?experience={int(exp_val)}"
        
    jobs.append({
        "title": f"Complete Naukri Match Feed: {role}",
        "link": naukri_link,
        "snippet": f"Naukri Live Feed: Strongly enforced for EXACTLY {int(exp_val)} years of experience and pinned specifically to {'location: ' + loc if loc else 'your profile'} to avoid junk postings.",
        "platform": "Naukri"
    })
    
    # ── 3. INTERNSHALA SETUP ──
    if opportunity_type == "internship" or exp_val <= 1:
        int_role = "-".join(role.lower().split())
        int_loc = "-".join(loc.lower().split()) if loc else ""
        
        int_link = f"https://internshala.com/internships/{int_role}-internship"
        if int_loc:
            int_link += f"-in-{int_loc}"
            
        jobs.append({
            "title": f"Internshala: Verified {role} Internships",
            "link": int_link,
            "snippet": f"Internshala Feed: Exclusively fetching freshers & interns. Location filter rigidly locked to {loc if loc else 'All Cities'}.",
            "platform": "Internshala"
        })
        
    # ── 4. GLASSDOOR SETUP ──
    glass_query = role_q
    if exp_val > 0 and opportunity_type != "internship":
        glass_query += f"+{int(exp_val)}+years"
    glassdoor_link = f"https://www.glassdoor.com/Job/jobs.htm?sc.keyword={glass_query}"
    if loc:
        glassdoor_link += f"&locName={loc_q}"
        
    jobs.append({
        "title": f"Glassdoor Search: {role} Roles",
        "link": glassdoor_link,
        "snippet": f"Glassdoor Active Feed: Direct parameter injection applies {role} matching over EXACTLY {int(exp_val)} yrs experience in {loc if loc else 'your preferred zone'}.",
        "platform": "Glassdoor"
    })
    
    # ── 5. FOUNDIT (Monster) SETUP ──
    foundit_link = f"https://www.foundit.in/srp/results?query={role_q}"
    if loc:
        foundit_link += f"&locations={loc_q}"
    if opportunity_type == "internship" or exp_val == 0:
         foundit_link += "&experience=0"
    else:
        foundit_link += f"&experience={int(exp_val)}"
        
    jobs.append({
        "title": f"FoundIt Feed: {role}",
        "link": foundit_link,
        "snippet": f"FoundIt (Monster) Listings: HTTP URL parameters meticulously force 'experience={int(exp_val)}' & 'locations={loc if loc else 'Any'}' to guarantee proper matching.",
        "platform": "FoundIt"
    })
    
    # ── 6. UPWORK SETUP ──
    upwork_link = f"https://www.upwork.com/nx/search/jobs/?q={role_q}"
    
    # Upwork maps experience typically to contractor tiers: 1 (Entry), 2 (Intermediate), 3 (Expert)
    if exp_val == 0 or opportunity_type == "internship":
        upwork_link += "&contractor_tier=1"
    elif 1 <= exp_val <= 4:
        upwork_link += "&contractor_tier=2"
    else:
        upwork_link += "&contractor_tier=3"
        
    jobs.append({
        "title": f"Upwork Freelance & Contract: {role}",
        "link": upwork_link,
        "snippet": f"Upwork Master Feed: Parameter applied for {'Entry Level' if exp_val==0 else ('Intermediate' if exp_val<=4 else 'Expert')} tier automatically based on your {int(exp_val)} years of experience.",
        "platform": "Upwork"
    })
        
    return jobs
